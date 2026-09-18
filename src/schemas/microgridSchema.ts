import Ajv from 'ajv';
import type { JSONSchemaType } from 'ajv';
import type { MicrogridPayload, ValidationErrorItem } from '@/types/microgrid';

const ajv = new Ajv({ allErrors: true, verbose: true, strict: false });

export const microgridJsonSchema = {
  type: 'object',
  required: ['scenario_id', 'operator_notes', 'hours', 'battery'],
  properties: {
    scenario_id: {
      type: 'string',
      minLength: 1,
    },
    operator_notes: {
      type: 'array',
      minItems: 1,
      maxItems: 3,
      items: {
        type: 'string',
      },
    },
    hours: {
      type: 'array',
      minItems: 24,
      maxItems: 24,
      items: {
        type: 'object',
        required: ['hour', 'demand_kwh', 'solar_kwh', 'tariff_bdt_per_kwh'],
        properties: {
          hour: {
            type: 'integer',
            minimum: 0,
            maximum: 23,
          },
          demand_kwh: {
            type: 'number',
          },
          solar_kwh: {
            type: 'number',
          },
          tariff_bdt_per_kwh: {
            type: 'number',
          },
        },
      },
    },
    battery: {
      type: 'object',
      required: [
        'capacity_kwh',
        'initial_energy_kwh',
        'minimum_energy_kwh',
        'max_charge_kwh_per_hour',
        'max_discharge_kwh_per_hour',
      ],
      properties: {
        capacity_kwh: { type: 'number' },
        initial_energy_kwh: { type: 'number' },
        minimum_energy_kwh: { type: 'number' },
        max_charge_kwh_per_hour: { type: 'number' },
        max_discharge_kwh_per_hour: { type: 'number' },
      },
    },
  },
};

const validateCompiled = ajv.compile(microgridJsonSchema);

export interface ValidationResult {
  valid: boolean;
  errors: ValidationErrorItem[];
  parsedData?: MicrogridPayload;
}

export function validateMicrogridPayload(rawInput: unknown): ValidationResult {
  const errors: ValidationErrorItem[] = [];

  if (!rawInput || typeof rawInput !== 'object') {
    return {
      valid: false,
      errors: [
        {
          path: '/',
          field: 'payload',
          message: 'Payload must be a valid JSON object.',
        },
      ],
    };
  }

  const isValidSchema = validateCompiled(rawInput);

  if (!isValidSchema && validateCompiled.errors) {
    for (const err of validateCompiled.errors) {
      let formattedPath = err.instancePath ? err.instancePath.replace(/^\//, '').replace(/\//g, '.') : '';
      let fieldName = formattedPath || 'root';

      if (err.keyword === 'required' && err.params?.missingProperty) {
        const missing = err.params.missingProperty;
        fieldName = formattedPath ? `${formattedPath}.${missing}` : missing;
        formattedPath = formattedPath ? `${formattedPath}.${missing}` : missing;
      }

      errors.push({
        path: formattedPath || '/',
        field: fieldName,
        message: err.message ? `${fieldName} ${err.message}` : 'Invalid value',
        keyword: err.keyword,
      });
    }
  }

  // Domain-specific check: hour uniqueness and coverage [0-23]
  const data = rawInput as Partial<MicrogridPayload>;
  if (Array.isArray(data.hours)) {
    const seenHours = new Map<number, number[]>(); // hour -> array of indices
    data.hours.forEach((h, index) => {
      if (typeof h?.hour === 'number') {
        const existing = seenHours.get(h.hour) || [];
        existing.push(index);
        seenHours.set(h.hour, existing);
      }
    });

    // Check duplicates
    seenHours.forEach((indices, hr) => {
      if (indices.length > 1) {
        errors.push({
          path: `hours[${indices.join(', ')}]`,
          field: `hours.hour (${hr})`,
          message: `Hour ${hr} is duplicated at index ${indices.join(', ')}. All 24 hours (0-23) must be unique.`,
          keyword: 'uniqueHours',
        });
      }
    });

    // If 24 hours were given, check if all 0..23 exist
    if (data.hours.length === 24) {
      const missingHours: number[] = [];
      for (let i = 0; i < 24; i++) {
        if (!seenHours.has(i)) {
          missingHours.push(i);
        }
      }
      if (missingHours.length > 0) {
        errors.push({
          path: 'hours',
          field: 'hours',
          message: `Missing hours: ${missingHours.join(', ')}. Array must cover all 24 hours (0-23).`,
          keyword: 'hourCoverage',
        });
      }
    }
  }

  // Battery logical constraint check
  if (data.battery && typeof data.battery === 'object') {
    const { capacity_kwh, initial_energy_kwh, minimum_energy_kwh } = data.battery;
    if (typeof capacity_kwh === 'number' && typeof initial_energy_kwh === 'number' && initial_energy_kwh > capacity_kwh) {
      errors.push({
        path: 'battery.initial_energy_kwh',
        field: 'battery.initial_energy_kwh',
        message: `initial_energy_kwh (${initial_energy_kwh}) cannot exceed capacity_kwh (${capacity_kwh}).`,
        keyword: 'batteryCapacity',
      });
    }
    if (typeof capacity_kwh === 'number' && typeof minimum_energy_kwh === 'number' && minimum_energy_kwh > capacity_kwh) {
      errors.push({
        path: 'battery.minimum_energy_kwh',
        field: 'battery.minimum_energy_kwh',
        message: `minimum_energy_kwh (${minimum_energy_kwh}) cannot exceed capacity_kwh (${capacity_kwh}).`,
        keyword: 'batteryMinimum',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    parsedData: errors.length === 0 ? (rawInput as MicrogridPayload) : undefined,
  };
}
