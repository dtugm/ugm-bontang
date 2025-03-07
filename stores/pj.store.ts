import { collection, doc, setDoc } from "firebase/firestore";
import { useToast } from "vue-toastification";
const toast = useToast();
export const usePjStore = defineStore("pj", () => {
  const authStore: any = useAuthStore();
  const db = useFirestore();
  const lat = ref();
  const lng = ref();
  const userInfo = {
    user_id: authStore.user?.uid,
    user_name: authStore.user?.displayName,
    user_email: authStore.user?.email,
  };
  const presensiPj = async (check_type: string, userId: any, data: any) => {
    const employeeRef = collection(db, "pj");
    const employeeDoc = doc(employeeRef, userId);
    const logPresensiRef = collection(employeeDoc, "presensi_log");
    try {
      await setDoc(
        employeeDoc,
        {
          ...data,
          ...userInfo,
          lat: lat.value ?? 0,
          lng: lng.value ?? 0,
          [check_type]: tanggalIndoNowLengkap(),
        },
        { merge: true }
      ).then(async () => {
        toast.success("Berhasil Memperbarui Status Presensi");
      });
      await setDoc(
        doc(logPresensiRef, tanggalIndoNow()),
        {
          ...data,
          ...userInfo,
          lat: lat.value ?? 0,
          lng: lng.value ?? 0,
          [check_type]: jamIndoNow(),
          tanggal: tanggalIndoNow(),
        },
        { merge: true }
      );
    } catch (e) {
      toast.error("Gagal Melakukan Presensi :(");
    }
  };
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lat.value = position.coords.latitude;
          lng.value = position.coords.longitude;
        },
        (err) => {
          console.log(`Gagal mendapatkan lokasi: ${err.message}`);
        }
      );
    } else {
      console.log("Geolocation tidak didukung oleh browser ini.");
    }
  };
  // getLocation();
  return {
    presensiPj,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePjStore, import.meta.hot));
}
