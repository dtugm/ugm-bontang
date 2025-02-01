import { collection, doc, setDoc } from "firebase/firestore";
import { useToast } from "vue-toastification";
const toast = useToast();
export const useEmployeeStore = defineStore("employee", () => {
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
  const lat = ref();
  const lng = ref();
  const now = new Date();
  const waktuIndonesia = now.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Jakarta",
  });
  const jamIndo = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Gunakan format 24 jam
    timeZone: "Asia/Jakarta", // Sesuaikan dengan zona waktu yang diinginkan
  });

  const formattedDate = waktuIndonesia.split("/").reverse().join("-");
  const formattedJam = jamIndo.split("/").reverse().join("-");

  const updateAttendance = async (
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
          user_id: authStore.user?.uid,
          user_name: authStore.user?.displayName,
          user_email: authStore.user?.email,
          lat: lat.value ?? 0,
          lng: lng.value ?? 0,
          [check_type]: new Date().toLocaleTimeString("id-ID", options),
        },
        { merge: true }
      ).then(async () => {
        toast.success("Berhasil Memperbarui Status Presensi");
      });

      await setDoc(
        doc(logPresensiRef, formattedDate),
        {
          ...data,
          [check_type]: formattedJam,
          tanggal: formattedDate,
          user_id: authStore.user?.uid,
          user_name: authStore.user?.displayName,
          user_email: authStore.user?.email,
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

  return {
    formattedDate,
    updateAttendance,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEmployeeStore, import.meta.hot));
}
