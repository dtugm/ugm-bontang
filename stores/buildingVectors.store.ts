import vectorsApi from "~/app/api/vectors.api";

export const useBuildingVectors = defineStore("buildingVector", () => {
  const totalBuildingCounts = ref();
  return { totalBuildingCounts };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBuildingVectors, import.meta.hot));
}
