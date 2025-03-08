import {
  getFirestore,
  writeBatch,
  doc,
  collection,
  getDocs,
  collectionGroup,
  query,
  where,
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
  const bidangTanahData = ref([]);
  const getAllUpdatedFeature = async () => {
    try {
      const { data } = await surveyApi.lot_survey_monitorings();
      bidangTanahData.value = data;
      appStore.toastSuccess("Batch update berhasil!");
    } catch (error: any) {
      appStore.toastError(error);
    }
  };

  return {
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
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSurveyStore, import.meta.hot));
}
