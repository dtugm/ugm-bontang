import {
  apiDeleteData,
  apiGetData,
  apiPostData,
  apiPutData,
  CustomFormData,
} from "../helper";
const mainPath = "/users";

export default {
  get_all_users: async () => {
    return apiGetData(`${mainPath}`);
  },
};
