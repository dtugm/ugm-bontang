import lotSurveyApi from "~/app/api/lotSurvey.api";
import lotSurveyMonitoringsApi from "~/app/api/survey/lotSurveyMonitorings.api";
import vectorsApi from "~/app/api/vectors.api";
import landParcelConstant from "~/app/constant/landParcel.constant";
import { FormInput } from "~/app/helper";

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
    return {
      getDetailPersil,
      parcelAtribute,
      popUpParcel,
      attrLoading,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useLotSurveyMonitoring, import.meta.hot)
  );
}
