import lotSurveyApi from "~/app/api/lotSurvey.api";
import lotSurveyMonitoringsApi from "~/app/api/survey/lotSurveyMonitorings.api";
import vectorsApi from "~/app/api/vectors.api";
import landParcelConstant from "~/app/constant/landParcel.constant";
import { FormInput } from "~/app/helper";
import { apiWrapper } from "~/app/helper/api.helper";

export const useLotSurveyMonitoring = defineStore(
  "lotSurveyMonitorings",
  () => {
    const popUpParcel = ref(false);
    const parcelAtribute = ref({});
    const attrLoading = ref(false);
    const getDetailPersil = async (fid: string) => {
      attrLoading.value = true;
      popUpParcel.value = true;
      try {
        const resp = await lotSurveyMonitoringsApi.get_survey_by_fid({
          fid: fid,
        });
        parcelAtribute.value = resp;
      } catch (error) {
        parcelAtribute.value = {};
      }
      attrLoading.value = false;
    };
    const deletePersilLoading = ref(false);
    const deletePersil = async (id: string) => {
      deletePersilLoading.value = true;
      await apiWrapper(
        () => lotSurveyMonitoringsApi.delete_lot_survey_monitoring({ id: id }),
        {
          successMessage: "Berhasil menghapus data!",
        }
      );
      deletePersilLoading.value = false;
    };
    return {
      getDetailPersil,
      parcelAtribute,
      popUpParcel,
      attrLoading,

      deletePersil,
      deletePersilLoading,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useLotSurveyMonitoring, import.meta.hot)
  );
}
