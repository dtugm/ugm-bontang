import { apiGetData, apiPostData, apiPutData } from "../helper";
const mainPath = "/vectors";

export default {
  get_all_vectors: async (payload?: any) => {
    return apiGetData(`${mainPath}?`, payload);
  },
  upload_vector: async (payload?: any) => {
    return apiPostData(`${mainPath}`, payload);
  },
  edit_vector: async (payload?: any) => {
    return apiPutData(`${mainPath}`, payload);
  },
};
