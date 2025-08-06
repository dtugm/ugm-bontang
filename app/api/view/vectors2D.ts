import {
  apiGetData,
  buildPath,
  apiDeleteData,
  apiPutData,
} from "~/app/axios/axiosBearer";
import { apiPostData, objectToFormData } from "~/app/helper";

const mainPath = "/vectors";

export default {
  get_vector: async (params?: IGet3DModelParams) => {
    return apiGetData(`${mainPath}?`, params);
  },
  create_vector: async (payload: IUploadVectorsPayload) => {
    const formData = objectToFormData(payload);
    return apiPostData(`${mainPath}`, formData);
  },
  edit_vector: async (path: IPathId, payload: ICreate3DModelPayload) => {
    const formData = objectToFormData(payload);
    const customPath = buildPath(`${mainPath}/{id}`, path);
    return apiPutData(customPath, formData);
  },
  delete_vector: async (path: IPathId) => {
    const customPath = buildPath(`${mainPath}/{id}`, path);
    return apiDeleteData(customPath);
  },
};
