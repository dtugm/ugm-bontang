import {
  apiDeleteData,
  apiGetData,
  apiPostData,
  apiPutData,
  CustomFormData,
} from "../helper";
const mainPath = "/groups";

export default {
  get_group_info_by_id: async (groupId: string) => {
    return apiGetData(`${mainPath}/${groupId}?`);
  },
  add_member_to_group: async (groupId: string, payload: any) => {
    return apiPostData(`${mainPath}/${groupId}/members`, payload);
  },
};
