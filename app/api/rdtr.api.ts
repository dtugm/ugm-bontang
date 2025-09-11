import { apiGetData } from "../helper";
const mainPath = "/parcels";
const rdtrPath = "/zoning-plan";

export default {
  get_intersect: async (id: string) => {
    return apiGetData(`${mainPath}/intersecting-geometris/${id}`);
  },
  get_name_objs: async () => {
    return apiGetData(`${rdtrPath}/name-objs`);
  }
};
