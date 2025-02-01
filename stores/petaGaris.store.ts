import { collectionGroup, getDocs, query, where } from "firebase/firestore";

export const usePetaGarisStore = defineStore("petaGaris", () => {
  const totalGrid: any = ref(0);
  const totalArray: any = ref([]);
  const leaderBoard = ref({});
  const queryAll = async () => {
    const db = useFirestore();
    const tasksQuery = query(
      collectionGroup(db, "peta_garis_task"),
      where("status", "==", 3)
    );
    const tasksSnapshot = await getDocs(tasksQuery);
    const taskCount: any = {};
    let results: any = [];
    tasksSnapshot.forEach((doc) => {
      const taskData = doc.data();
      const taskId = doc.id;
      const fullPath = doc.ref.path;
      const employeeId = fullPath.split("/")[3];
      if (!taskCount[employeeId]) {
        taskCount[employeeId] = 0;
      }
      taskCount[employeeId]++;
      results.push({
        employeeId,
        taskId,
        ...taskData,
      });
    });
    totalGrid.value = results.length;
    totalArray.value = results;
    leaderBoard.value = taskCount;
  };
  queryAll();
  return {
    leaderBoard,
    totalGrid,
    totalArray,
    queryAll,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePetaGarisStore, import.meta.hot));
}
