export const usePjStore = defineStore("pj", () => {
  const presensiPj = async () => {};
  return {};
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePjStore, import.meta.hot));
}
