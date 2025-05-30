import lotSurveyApi from "~/app/api/lotSurvey.api";
import vectorsApi from "~/app/api/vectors.api";
import landParcelConstant from "~/app/constant/landParcel.constant";

export const useLandDataStore = defineStore("landData", () => {
  const readLotSurveyData = reactive(
    useTableData<ILotSurveyItems, IGetLotSurveyParams>(
      [...landParcelConstant.table_data.headers!],
      lotSurveyApi.getLotSurveyData
    )
  );

  return {
    readLotSurveyData,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLandDataStore, import.meta.hot));
}
