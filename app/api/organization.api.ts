import {
  apiDeleteData,
  apiGetData,
  apiPatchData,
  apiPostData,
  apiPutData,
  CustomFormData,
} from "../helper";
const mainPath = "/organizations";

export default {
  add_user_to_organization: async (payload: any) => {
    return apiPostData(`${mainPath}/add-user`, payload);
  },
  patch_user_to_bontang: async (id: any) => {
    return apiPatchData(`${mainPath}/${id}/set-active`);
  },
};
