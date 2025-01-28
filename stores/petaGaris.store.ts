import { collectionGroup, getDocs, query, where } from "firebase/firestore";

export const usePetaGarisStore = defineStore("petaGaris", () => {
  const totalGrid: any = ref(0);
  const totalArray: any = ref([]);
  const queryAll = async () => {
    const db = useFirestore();
    const tasksQuery = query(
      collectionGroup(db, "peta_garis_task"),
      where("status", "==", 3)
    );
    const tasksSnapshot = await getDocs(tasksQuery);
    totalArray.value = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    totalGrid.value = tasksSnapshot.docs.length;
  };
  queryAll();
  return {
    totalGrid,
    totalArray,
    queryAll,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePetaGarisStore, import.meta.hot));
}
