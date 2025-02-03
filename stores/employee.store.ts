import { collection, doc, setDoc } from "firebase/firestore";
import { useToast } from "vue-toastification";
const toast = useToast();
export const useEmployeeStore = defineStore("employee", () => {
  const authStore: any = useAuthStore();
  const db = useFirestore();
  const lat = ref();
  const lng = ref();
  const updateAttendance = async (
    userInfo: any,
    check_type: string,
    userId: any,
    data: any
  ) => {
    const employeeRef = collection(db, "employee");
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
  getLocation();
  const updateAttendanceByAdmin = async (
    check_type: string,
    userId: any,
    data: any
  ) => {
    const employeeRef = collection(db, "employee");
    const employeeDoc = doc(employeeRef, userId);
    const logPresensiRef = collection(employeeDoc, "presensi_log");
    try {
      await setDoc(
        employeeDoc,
        {
          ...data,
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
          [check_type]: jamIndoNow(),
          tanggal: tanggalIndoNow(),
        },
        { merge: true }
      );
    } catch (e) {
      toast.error("Gagal Melakukan Presensi :(");
    }
  };
  return {
    updateAttendance,
    updateAttendanceByAdmin,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEmployeeStore, import.meta.hot));
}
