// utils/apiWrapper.ts
import { useToast } from "vue-toastification";

const toast = useToast();

type ApiWrapperOptions = {
  successMessage?: string;
  errorMessage?: string;
  silent?: boolean; // kalau true, nggak ada toast
};

export async function apiWrapper<T>(
  fn: () => Promise<T>,
  options?: ApiWrapperOptions
): Promise<T | null> {
  try {
    const result = await fn();

    if (!options?.silent && options?.successMessage) {
      toast.success(options.successMessage);
    }
    return result;
  } catch (error: any) {
    console.error(error);

    if (!options?.silent) {
      toast.error(
        options?.errorMessage || error.message || "Terjadi kesalahan"
      );
    }

    return null;
  }
}
