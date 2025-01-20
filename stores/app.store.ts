import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();
export const useAppStore = defineStore("app", () => {
  const toastSuccess = (message: string) => {
    toast.success(message);
  };
  const toastError = (message: string) => {
    toast.error(message);
  };
  return {
    toastSuccess,
    toastError,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
