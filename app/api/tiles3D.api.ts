import {
  apiDeleteData,
  apiGetData,
  apiPostData,
  apiPutData,
  CustomFormData,
  objectToFormData,
} from "../helper";
const mainPath = "/3d-tiles";

export default {
  get_all_3d_tiles: async (params?: IGet3dTilesParams) => {
    return apiGetData(`${mainPath}?`, params);
  },
  upload_3d_tiles: async (payload: IUpload3dTilesPayload) => {
    const formData = objectToFormData(payload);
    return apiPostData(`${mainPath}`, formData, {
      "Content-Type": "multipart/form-data",
    });
  },
  edit_3d_tiles: async (id: string, payload: IUpload3dTilesPayload) => {
    const formData = objectToFormData(payload);
    return apiPutData(`${mainPath}/${id}`, formData, {
      "Content-Type": "multipart/form-data",
    });
  },
  delete_3d_tiles: async (id: string) => {
    return apiDeleteData(`${mainPath}/${id}`);
  },
};
