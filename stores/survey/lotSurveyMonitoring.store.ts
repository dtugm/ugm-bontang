import lotSurveyApi from "~/app/api/lotSurvey.api";
import lotSurveyMonitoringsApi from "~/app/api/survey/lotSurveyMonitorings.api";
import vectorsApi from "~/app/api/vectors.api";
import { landTypeMap } from "~/app/constant/data/landParcelMapping.constant";
import landParcelConstant from "~/app/constant/landParcel.constant";
import { FormInput } from "~/app/helper";
import { apiWrapper } from "~/app/helper/api.helper";
import { STAWPOP } from "~/app/types/enums/landParcel";

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
    const editPersilLoading = ref(false);
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
    const editPersil = async (
      id: string,
      payload: { data: Partial<ILotSurveyItems>; images: any }
    ) => {
      editPersilLoading.value = true;
      console.log(payload);
      await apiWrapper(() => lotSurveyApi.EditMonitoring(payload, id), {
        successMessage: "Berhasil Mengupdate data!",
      });
      editPersilLoading.value = false;
    };
    const kelurahanOption = [
      { title: "Lok Tuan", value: "Lok Tuan" },
      { title: "Bontang Baru", value: "Bontang Baru" },
      { title: "Api Api", value: "Api api" },
    ];
    const staWpopOptions = Object.values(STAWPOP);
    const landTypeOptions = Object.entries(landTypeMap).map(
      ([value, title]) => ({
        value,
        title,
      })
    );
    return {
      getDetailPersil,
      parcelAtribute,
      popUpParcel,
      attrLoading,

      deletePersil,
      deletePersilLoading,

      editPersil,
      editPersilLoading,

      landTypeOptions,
      kelurahanOption,
      staWpopOptions,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useLotSurveyMonitoring, import.meta.hot)
  );
}
