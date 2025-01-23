import { collection, getFirestore } from "firebase/firestore";
import { defineStore } from "pinia";
export const useSurveyStore = defineStore("survey", () => {
  const db = getFirestore();
  let persilStatus;
  const refreshPersil = ref(true);
  const refreshLoading = ref(false);
  const changeStatus = () => {
    refreshPersil.value = false;
    refreshLoading.value = true;
    persilStatus = useCollection(collection(db, "surveyProgress"), {
      once: true,
    });
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
