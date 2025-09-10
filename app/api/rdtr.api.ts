import { apiGetData } from "../helper";
const mainPath = "/parcels";

export default {
  get_intersect: async (id: string) => {
    return apiGetData(`${mainPath}/intersecting-geometris/${id}`);
  },
};
