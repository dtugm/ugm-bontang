import {
  apiGetData,
} from "../helper";
const mainPath = "/parcels";

export default {
  get_bbox: async (params?: IGetParcelsBboxParams) => {
    return apiGetData(`${mainPath}/bbox`, params);
  },
};
