import {
  getFirestore,
  writeBatch,
  doc,
  collection,
  getDocs,
  collectionGroup,
  query,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import surveyApi from "~/app/api/survey.api";
export const useSurveyStore = defineStore("survey", () => {
  const appStore = useAppStore();
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

  // Survey Bidang Tanah Bontang Baru

  // Read Done Status
  const totalObject = {
    bontang_baru: null,
    api_api: null,
    loktuan: null,
  };
  const bidang_bontang_baru = ref([]);
  const bidangTanahQuery = query(
    collectionGroup(db, "survey_bidang_bontang_baru"),
    where("status", "==", true)
  );
  const getAllDoneBidangTanah = async () => {
    const employeeSnapshot = await getDocs(bidangTanahQuery);
    let bindagTanahData: any = [];
    employeeSnapshot.forEach((doc) => {
      bindagTanahData.push({ ...doc.data() });
    });
    bidang_bontang_baru.value = bindagTanahData;
    // console.log(bindagTanahData);
  };

  // Write status
  const bulkUpdate = async (
    collectionName: any,
    updates: any,
    nama_survey: string,
    dokumen_kelurahan: string
  ) => {
    const batch = writeBatch(db);
    updates.forEach((item: any) => {
      if (!item.FID) return;
      const parentDocRef = doc(db, collectionName, dokumen_kelurahan);
      const subCollectionRef = collection(parentDocRef, nama_survey);
      const subDocRef = doc(subCollectionRef, `FID_${item.FID.toString()}`);
      batch.set(subDocRef, item);
    });

    try {
      await batch.commit();
      appStore.toastSuccess("Batch update berhasil!");
    } catch (error: any) {
      appStore.toastError(error);
    }
  };

  const addUpdatedBulkFeature = async (arrayData: any) => {
    try {
      const promises = arrayData
        .filter((item: any) => item.fid)
        .map(async (item: any) => {
          const formData = new FormData();
          formData.append("data", JSON.stringify(item));
          await surveyApi.post_lot_survey_monitorings(formData);
        });

      const data = await Promise.all(promises);

      appStore.toastSuccess("Batch update berhasil!");
    } catch (error: any) {
      appStore.toastError(error);
    }
  };
  const bangunanData = ref([]);
  const bidangTanahData = ref([]);
  const getAllUpdatedFeature = async () => {
    try {
      const { data } = await surveyApi.lot_survey_monitorings({
        pageSize: 10000,
      });
      bidangTanahData.value = data;
      // appStore.toastSuccess("Batch update berhasil!");
    } catch (error: any) {
      appStore.toastError(error);
    }
  };
  const bidangTanahBontangBaruItems = ref([]);

  const getBidangTanahBontangBaru = async () => {
    try {
      const properties = await addGeoJsonProperties(
        "/SurveyPbb/peta_kerja_bontang_baru.geojson"
      );
      const { data } = await surveyApi.lot_survey_monitorings({
        pageSize: 10000,
      });

      const mapData = new Map(data.map((item: any) => [item.fid, item]));

      bidangTanahBontangBaruItems.value = properties.map((item: any) => ({
        ...item,
        ...(mapData.get(String(item.FID)) || {}),
      }));
    } catch (error: any) {
      appStore.toastError(error.message);
    }
  };
  const postBidangTanahBontangBaru = async (payload: any) => {
    try {
      const formData = new FormData();

      formData.append("images", payload.images);
      formData.append("data", JSON.stringify(payload.data));
      await surveyApi.post_lot_survey_monitorings(formData);

      appStore.toastSuccess("Add Data Berhasil!");
    } catch (error: any) {
      appStore.toastError(error.message);
    }
  };
  const putBidangTanahBontangBaru = async (payload: any) => {
    try {
      const formData = new FormData();

      formData.append("images", payload.images);
      formData.append("data", JSON.stringify(payload.data));
      await surveyApi.put_lot_survey_monitorings(formData, payload.data.id);

      appStore.toastSuccess("Edit Data Berhasil!");
    } catch (error: any) {
      appStore.toastError(error.message);
    }
  };

  const deleteBidangTanahBontangBaru = async (id: string) => {
    try {
      await surveyApi.delete_lot_survey_monitorings(id);
      appStore.toastSuccess("Hapus Data Berhasil!");
    } catch (error: any) {
      appStore.toastError(error.message);
    }
  };
  const lat = ref();
  const lng = ref();
  const addLogBook = async (
    collectionName: any,
    data: any,
    nama_survey: string,
    dokumen_kelurahan: string
  ) => {
    try {
      const parentDocRef = doc(db, collectionName, dokumen_kelurahan);
      const subCollectionRef = collection(parentDocRef, nama_survey);
      const uniqueId = new Date().getTime(); // Bisa juga pakai uuidv4()
      const subDocRef = doc(
        subCollectionRef,
        `${data.team}_${data.date}_${uniqueId}`
      );

      await setDoc(subDocRef, { ...data, lat: lat.value, lng: lng.value });

      appStore.toastSuccess("Data berhasil diperbarui!");
    } catch (error: any) {
      console.log(error);
      appStore.toastError(error);
    }
  };
  const logBookData = ref([]);
  const logBookQuery = query(collectionGroup(db, "log_book_bontang_baru"));
  const getAllLogBook = async () => {
    const logbookSnapshot = await getDocs(logBookQuery);
    let logBookSurvey: any = [];

    logbookSnapshot.forEach((doc) => {
      logBookSurvey.push({ id: doc.id, path: doc.ref.path, ...doc.data() }); // Simpan path lengkap
    });

    logBookData.value = logBookSurvey;
    // console.log(logBookSurvey);
  };

  const deleteLogBook = async (docPath: any) => {
    try {
      await deleteDoc(doc(db, docPath)); // Gunakan path lengkap
      console.log(`Dokumen ${docPath} berhasil dihapus`);

      // Hapus dari state agar tampilan diperbarui
      logBookData.value = logBookData.value.filter(
        (item: any) => item.path !== docPath
      );
    } catch (error) {
      console.error("Gagal menghapus dokumen:", error);
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
    addLogBook,
    logBookData,
    refreshLoading,
    refreshPersil,
    persilStatus,
    changeStatus,
    bidang_bontang_baru,
    getAllDoneBidangTanah,
    bulkUpdate,
    totalObject,
    addUpdatedBulkFeature,
    getAllUpdatedFeature,
    bidangTanahData,

    getBidangTanahBontangBaru,
    bidangTanahBontangBaruItems,
    postBidangTanahBontangBaru,
    putBidangTanahBontangBaru,
    deleteBidangTanahBontangBaru,
    getAllLogBook,
    deleteLogBook,
    bangunanData,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSurveyStore, import.meta.hot));
}
