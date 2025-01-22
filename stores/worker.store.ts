import { collection, doc, setDoc } from "firebase/firestore";
import { useToast } from "vue-toastification";
const toast = useToast();
export const useWorkerStore = defineStore("worker", () => {
  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const authStore: any = useAuthStore();
  const db = useFirestore();
  // const workerStatus = ref({});
  const workerStatus: any = useDocument(
    doc(collection(db, "attendance"), authStore.user?.uid)
  );
  // const test = () => {
  //   console.log(workerStatus.value.check_in_time);
  // };
  const updateAttendance = async (
    check_type: string,
    userId: any,
    data: any
  ) => {
    try {
      await setDoc(
        doc(db, "attendance", userId),
        {
          ...data,
          user_id: authStore.user?.uid,
          user_name: authStore.user?.displayName,
          user_email: authStore.user?.email,
          [check_type]: new Date().toLocaleTimeString("id-ID", options),
        },
        { merge: true }
      ).then(() => {
        toast.success("Berhasil Melakukan Presensi!");
        // workerStatus.value = useDocument(
        //   doc(collection(db, "attendance"), authStore.user?.uid)
        // );
      });
    } catch (e) {
      toast.error("Gagal Melakukan Presensi :(");
    }
  };
  return {
    updateAttendance,
    workerStatus,
    // test,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWorkerStore, import.meta.hot));
}
