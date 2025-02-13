import { collectionGroup, getDocs, query, where } from "firebase/firestore";

export const usePetaGarisStore = defineStore("petaGaris", () => {
  const totalGrid: any = ref(0);
  const totalArray: any = ref([]);
  const leaderBoard = ref({});
  const todoReview = ref({});
  const queryAll = async () => {
    console.log("getBang");
    const db = useFirestore();
    const tasksQuery = query(
      collectionGroup(db, "peta_garis_task"),
      where("status", "==", 3)
    );
    const tasksQueryReview = query(
      collectionGroup(db, "peta_garis_task"),
      where("status", "==", 1)
    );
    const tasksSnapshot = await getDocs(tasksQuery);
    const toDoReview = await getDocs(tasksQueryReview);
    const taskCount: any = {};
    const taskReviewCount: any = {};
    let results: any = [];
    console.log(tasksQuery);
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
    toDoReview.forEach((doc) => {
      // const taskData = doc.data();
      // const taskId = doc.id;
      const fullPath = doc.ref.path;
      const employeeId = fullPath.split("/")[3];
      if (!taskReviewCount[employeeId]) {
        taskReviewCount[employeeId] = 0;
      }
      taskReviewCount[employeeId]++;
      // results.push({
      //   employeeId,
      //   taskId,
      //   ...taskData,
      // });
    });
    totalGrid.value = results.length;
    totalArray.value = results;
    leaderBoard.value = taskCount;
    todoReview.value = taskReviewCount;
  };

  // queryAll();
  return {
    leaderBoard,
    totalGrid,
    totalArray,
    queryAll,
    todoReview,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePetaGarisStore, import.meta.hot));
}
