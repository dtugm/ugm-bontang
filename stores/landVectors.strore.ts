import vectorsApi from "~/app/api/vectors.api";
import landParcelConstant from "~/app/constant/landParcel.constant";

export const useLandVectors = defineStore("landVectors", () => {
  const totalLandParcelCounts = ref();
  const landParcelItems = ref([]);
  const readSiteInformationData = reactive(
    useTableData<IGetVectorsParams, IGetVectorsParams>(
      [...landParcelConstant.table_vectors.headers!],
      vectorsApi.get_all_vectors,
      {
        category: "land_parcel",
      }
    )
  );
  const getLandParcel = async (payload: any) => {
    const resp = await vectorsApi.get_all_vectors(payload);
    landParcelItems.value = resp;
  };
  return {
    landParcelItems,
    getLandParcel,
    totalLandParcelCounts,
    readSiteInformationData,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLandVectors, import.meta.hot));
}
