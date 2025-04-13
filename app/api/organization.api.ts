import {
  apiDeleteData,
  apiGetData,
  apiPostData,
  apiPutData,
  CustomFormData,
} from "../helper";
const mainPath = "/organizations";

export default {
  add_user_to_organization: async (payload: any) => {
    return apiPostData(`${mainPath}/add-user`, payload);
  },
};
