import tiles3DApi from "~/app/api/tiles3D.api";

export const use3dTilesStore = defineStore("3dTiles", () => {
  const isFetchingData = ref(false);
  const tiles3dItems: any = ref([]);
  const getAll3dTiles = async () => {
    isFetchingData.value = true;
    const resp = await tiles3DApi.get_all_3d_tiles();
    tiles3dItems.value = resp;
    isFetchingData.value = false;
    return resp;
  };

  const upload3dTiles = async (payload: IUpload3dTilesPayload) => {
    const resp = await tiles3DApi.upload_3d_tiles(payload);
  };

  const delete3dTiles = async (id: string) => {
    const resp = await tiles3DApi.delete_3d_tiles(id);
  };
  return {
    getAll3dTiles,
    tiles3dItems,
    upload3dTiles,
    delete3dTiles,
    isFetchingData,
  };
});
