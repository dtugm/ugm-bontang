import surveyApi from "~/app/api/survey.api";
import { useFormDialog } from "~/composable/useFormDialog";

export const useSurveyDataStore = defineStore("admin/survey", () => {
  const appStore = useAppStore();

  // Data Survey
  const data_persil_bontang_baru = ref([]);
  const data_persil_api_api = ref([]);
  const data_persil_loktuan = ref([]);
  const persilTargets: any = {
    bontang_baru: data_persil_bontang_baru,
    api_api: data_persil_api_api,
    loktuan: data_persil_loktuan,
  };

  const getDataPersil = async (targetRef: any, payload: any) => {
    const { data } = await surveyApi.lot_survey_monitorings({
      pageSize: 10000,
      ...payload,
    });
    persilTargets[targetRef].value = data;
  };

  const deleteBidangTanahBontangBaru = async (id: string) => {
    try {
      await surveyApi.delete_lot_survey_monitorings(id);
      appStore.toastSuccess("Hapus Data Berhasil!");
    } catch (error: any) {
      appStore.toastError(error.message);
    }
  };

  return {
    getDataPersil,
    data_persil_bontang_baru,
    deleteBidangTanahBontangBaru,

    data_persil_api_api,
    data_persil_loktuan,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSurveyDataStore, import.meta.hot));
}
