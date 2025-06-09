import {
  apiDeleteData,
  apiGetData,
  apiPostData,
  apiPutData,
  CustomFormData,
} from "../helper";
const mainPath = "/groups";

export default {
  get_all_groups: async () => {
    return apiGetData(`${mainPath}`);
  },
  get_group_info_by_id: async (groupId: string) => {
    return apiGetData(`${mainPath}/${groupId}?`);
  },
  add_new_group: async (payload: any) => {
    return apiPostData(`${mainPath}`, payload);
  },
  add_member_to_group: async (groupId: string, payload: any) => {
    return apiPostData(`${mainPath}/${groupId}/members`, payload);
  },
  delete_group: async (id: string) => {
    return apiDeleteData(`${mainPath}/${id}`);
  },
  delete_member_on_group: async (id: string, memberId: string) => {
    return apiDeleteData(`${mainPath}/${id}/members/${memberId}`);
  },
  edit_member_on_group: async (id: string, memberId: string, payload: any) => {
    return apiPutData(`${mainPath}/${id}/members/${memberId}`, payload);
  },
};
