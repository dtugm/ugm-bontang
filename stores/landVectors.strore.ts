import vectorsApi from "~/app/api/vectors.api";

export const useLandVectors = defineStore("landVectors", () => {
  const totalLandParcelCounts = ref();
  const landParcelItems = ref([]);
  const getLandParcel = async (payload: any) => {
    const resp = await vectorsApi.get_all_vectors(payload);
    landParcelItems.value = resp;

    console.log(resp);
  };
  return { landParcelItems, getLandParcel, totalLandParcelCounts };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLandVectors, import.meta.hot));
}
