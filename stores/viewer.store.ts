export const useViewerStore = defineStore("viewer-3d", () => {
  const cesiumViewer = useCesiumViewer();
  return {
    cesiumViewer,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useViewerStore, import.meta.hot));
}
