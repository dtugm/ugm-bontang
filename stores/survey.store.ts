import { defineStore } from "pinia";
export const useSurveyStore = defineStore("survey", () => {
  const persilStatus = ref([
    {
      D_NOP: "647401000200702230",
      status: true,
    },
    {
      D_NOP: "647401000200703540",
      status: true,
    },
    { D_NOP: "647401000200702780", status: false },
  ]);
  const refreshPersil = ref(true);
  const refreshLoading = ref(false);
  const changeStatus = () => {
    persilStatus.value[2].status = true;
    refreshPersil.value = false;
    refreshLoading.value = true;
    setTimeout(() => {
      refreshPersil.value = true;
      refreshLoading.value = false;
    }, 50);
  };
  return { refreshLoading, refreshPersil, persilStatus, changeStatus };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSurveyStore, import.meta.hot));
}
