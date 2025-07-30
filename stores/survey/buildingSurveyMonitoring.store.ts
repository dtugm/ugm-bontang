import lotSurveyApi from "~/app/api/lotSurvey.api";
import vectorsApi from "~/app/api/vectors.api";
import landParcelConstant from "~/app/constant/landParcel.constant";
import { FormInput } from "~/app/helper";

export const useBuildingSurveyMonitorings = defineStore(
  "buildingSurveyMonitorings",
  () => {
    const readLandParcel = reactive(
      useTableData<ILotSurveyItems, IGetLotSurveyParams>(
        [...landParcelConstant.land_parcel_table.headers!],
        lotSurveyApi.getLotSurveyData
      )
    );
    const createData = reactive(
      useFormDialog<IGetLotSurveyParams>(
        lotSurveyApi.post_lot_survey_monitorings,
        readLandParcel.getData
      )
    );
    const createFormInputs = useFormInputs<IGetLotSurveyParams>({
      category: new FormInput({
        label: "Milestone",
      }),
    });
    return {
      createData,
      readLandParcel,

      createFormInputs,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBuildingSurveyMonitorings, import.meta.hot)
  );
}
