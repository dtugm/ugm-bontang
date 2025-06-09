import tiles3DApi from "~/app/api/tiles3D.api";

export const use3dTilesStore = defineStore("3dTiles", () => {
  const tiles3dItems: any = ref([]);
  const getAll3dTiles = async () => {
    const resp = await tiles3DApi.get_all_3d_tiles();
    tiles3dItems.value = resp;
  };

  const upload3dTiles = async (payload: IUpload3dTilesPayload) => {
    const resp = await tiles3DApi.upload_3d_tiles(payload);
  };

  return {
    getAll3dTiles,
    tiles3dItems,
    upload3dTiles,
  };
});
