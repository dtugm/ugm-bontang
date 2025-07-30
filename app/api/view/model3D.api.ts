import {
  apiGetData,
  buildPath,
  apiDeleteData,
  apiPutData,
} from "~/app/axios/axiosBearer";
import { apiPostData, objectToFormData } from "~/app/helper";

const mainPath = "/3d-tiles";

export default {
  get_building_survey_monitoring: async (params: IGet3DModelParams) => {
    return apiGetData(`${mainPath}?`, params);
  },
  create_3d_tiles: async (payload: ICreate3DModelPayload) => {
    const formData = objectToFormData(payload);
    return apiPostData(`${mainPath}`, formData);
  },
  edit_3d_tiles: async (path: IPathId, payload: ICreate3DModelPayload) => {
    const formData = objectToFormData(payload);
    const customPath = buildPath(`${mainPath}/{id}`, path);
    return apiPutData(customPath, formData);
  },
  delete_3d_tiles: async (path: IPathId) => {
    const customPath = buildPath(`${mainPath}/{id}`, path);
    return apiDeleteData(customPath);
  },
};
