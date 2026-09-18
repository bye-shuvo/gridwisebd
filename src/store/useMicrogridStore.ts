import { create } from 'zustand';
import type { MicrogridPayload, OptimizationResponse, ValidationErrorItem } from '@/types/microgrid';
import { validateMicrogridPayload } from '@/schemas/microgridSchema';
import { fetchHealth, postOptimizeEnergy, generateSimulatedOptimization, type ApiError } from '@/services/api';
import { sampleMicrogridScenario } from '@/data/sampleScenario';
import toast from 'react-hot-toast';

interface HealthState {
  isHealthy: boolean;
  latencyMs: number;
  lastChecked: Date | null;
  errorMessage?: string;
  isChecking: boolean;
}

interface ServerErrorState {
  type: string;
  status?: number;
  message: string;
  detail?: unknown;
}

interface MicrogridStore {
  // Input State
  rawJson: string;
  activeTab: 'editor' | 'upload';
  activeFileName: string | null;

  // Validation State
  validationErrors: ValidationErrorItem[];
  parsedPayload: MicrogridPayload | null;

  // Execution & Progress State
  isSubmitting: boolean;
  submitProgress: number;
  progressStage: string;
  serverError: ServerErrorState | null;

  // Results State
  results: OptimizationResponse | null;

  // Health State
  health: HealthState;

  // Actions
  setRawJson: (json: string) => void;
  setActiveTab: (tab: 'editor' | 'upload') => void;
  validateCurrentJson: (showToast?: boolean) => boolean;
  loadPreset: (scenario?: MicrogridPayload) => void;
  loadJsonFile: (content: string, fileName: string) => void;
  clearErrors: () => void;
  clearResults: () => void;
  checkHealthStatus: () => Promise<void>;
  submitOptimization: (forceSimulation?: boolean) => Promise<void>;
}

export const useMicrogridStore = create<MicrogridStore>((set, get) => ({
  rawJson: JSON.stringify(sampleMicrogridScenario, null, 2),
  activeTab: 'editor',
  activeFileName: null,

  validationErrors: [],
  parsedPayload: sampleMicrogridScenario,

  isSubmitting: false,
  submitProgress: 0,
  progressStage: '',
  serverError: null,

  results: null,

  health: {
    isHealthy: false,
    latencyMs: 0,
    lastChecked: null,
    isChecking: false,
  },

  setRawJson: (json: string) => {
    set({ rawJson: json, serverError: null });
  },

  setActiveTab: (tab: 'editor' | 'upload') => {
    set({ activeTab: tab });
  },

  validateCurrentJson: (showToast = true): boolean => {
    const { rawJson } = get();
    try {
      const parsed = JSON.parse(rawJson);
      const res = validateMicrogridPayload(parsed);

      if (!res.valid) {
        set({
          validationErrors: res.errors,
          parsedPayload: null,
        });
        if (showToast) {
          toast.error(`Validation Failed: ${res.errors.length} issue(s) detected.`, {
            id: 'validation-toast',
            icon: '❌',
          });
        }
        return false;
      }

      set({
        validationErrors: [],
        parsedPayload: res.parsedData ?? null,
      });
      return true;
    } catch (syntaxErr: unknown) {
      const syntaxMsg = syntaxErr instanceof Error ? syntaxErr.message : 'Invalid JSON format';
      const errors: ValidationErrorItem[] = [
        {
          path: '/',
          field: 'JSON Syntax',
          message: `Malformed JSON Syntax: ${syntaxMsg}`,
        },
      ];
      set({
        validationErrors: errors,
        parsedPayload: null,
      });
      if (showToast) {
        toast.error('Invalid JSON syntax: Please check brackets, commas, or quotes.', {
          id: 'json-syntax-toast',
          icon: '❌',
        });
      }
      return false;
    }
  },

  loadPreset: (scenario = sampleMicrogridScenario) => {
    const jsonStr = JSON.stringify(scenario, null, 2);
    set({
      rawJson: jsonStr,
      activeFileName: null,
      validationErrors: [],
      parsedPayload: scenario,
      serverError: null,
    });
    toast.success(`Loaded preset scenario: ${scenario.scenario_id}`);
  },

  loadJsonFile: (content: string, fileName: string) => {
    set({ rawJson: content, activeFileName: fileName, serverError: null });
    const isValid = get().validateCurrentJson(true);
    if (isValid) {
      toast.success(`Successfully loaded and validated "${fileName}"`);
    }
  },

  clearErrors: () => {
    set({ validationErrors: [], serverError: null });
  },

  clearResults: () => {
    set({ results: null, serverError: null });
  },

  checkHealthStatus: async () => {
    set((state) => ({ health: { ...state.health, isChecking: true } }));
    const result = await fetchHealth();
    set({
      health: {
        isHealthy: result.isHealthy,
        latencyMs: result.latencyMs,
        lastChecked: new Date(),
        errorMessage: result.errorMessage,
        isChecking: false,
      },
    });
  },

  submitOptimization: async (forceSimulation = false) => {
    const { validateCurrentJson, parsedPayload } = get();

    // 1. Client-side schema validation before POST
    const isValid = validateCurrentJson(true);
    if (!isValid || !parsedPayload) {
      return;
    }

    set({
      isSubmitting: true,
      submitProgress: 15,
      progressStage: 'Validating microgrid telemetry & constraints...',
      serverError: null,
    });

    try {
      // Progress simulation for responsive UX
      setTimeout(() => {
        if (get().isSubmitting) {
          set({ submitProgress: 45, progressStage: 'Sending scenario to Microgrid Solver...' });
        }
      }, 300);

      setTimeout(() => {
        if (get().isSubmitting) {
          set({ submitProgress: 75, progressStage: 'Optimizing battery dispatch & tariff peak-shaving...' });
        }
      }, 700);

      let responseData: OptimizationResponse;

      if (forceSimulation) {
        // Explicit simulation mode
        await new Promise((resolve) => setTimeout(resolve, 800));
        responseData = generateSimulatedOptimization(parsedPayload);
      } else {
        responseData = await postOptimizeEnergy(parsedPayload);
      }

      set({
        submitProgress: 100,
        progressStage: 'Compiling 24-hour visual schedule...',
      });

      await new Promise((r) => setTimeout(r, 200));

      set({
        results: responseData,
        isSubmitting: false,
        submitProgress: 0,
        progressStage: '',
      });

      toast.success(`Optimization successful! Plan generated for ${responseData.scenario_id}`, {
        duration: 4000,
      });
    } catch (err: unknown) {
      set({ isSubmitting: false, submitProgress: 0, progressStage: '' });

      const apiErr = err as ApiError;
      if (apiErr?.type === 'VALIDATION_ERROR') {
        set({
          serverError: {
            type: 'VALIDATION_ERROR',
            status: apiErr.status,
            message: apiErr.message,
            detail: apiErr.detail,
          },
        });
        toast.error(`Server Error (${apiErr.status}): ${apiErr.message}`, {
          icon: '⚠️',
          style: {
            background: '#1e1b18',
            border: '1px solid #f59e0b',
            color: '#fef3c7',
          },
          duration: 5000,
        });
      } else if (apiErr?.type === 'SERVER_ERROR') {
        set({
          serverError: {
            type: 'SERVER_ERROR',
            status: apiErr.status,
            message: 'server error, retry',
          },
        });
        toast.error('server error, retry', { duration: 5000 });
      } else if (apiErr?.type === 'NETWORK_ERROR' || apiErr?.type === 'TIMEOUT') {
        set({
          serverError: {
            type: apiErr.type,
            message: apiErr.message,
          },
        });
        toast.error(apiErr.message || 'Network connection failed. Retry available.', {
          duration: 6000,
        });
      } else if (apiErr?.type === 'MALFORMED_JSON') {
        set({
          serverError: {
            type: 'MALFORMED_JSON',
            message: 'Malformed response JSON from optimizer server.',
          },
        });
        toast.error('Malformed response JSON received from server.', { duration: 5000 });
      } else {
        const fallbackMsg = err instanceof Error ? err.message : 'Unknown error during optimization';
        set({
          serverError: {
            type: 'UNKNOWN_ERROR',
            message: fallbackMsg,
          },
        });
        toast.error(fallbackMsg);
      }
    }
  },
}));
