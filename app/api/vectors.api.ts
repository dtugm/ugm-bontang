import { apiGetData } from "../helper";
const mainPath = "/vectors";

export default {
  get_all_vectors: async (payload?: any) => {
    return apiGetData(`${mainPath}?`, payload);
  },
};
