import {
  apiDeleteData,
  apiGetData,
  apiPostData,
  apiPutData,
  CustomFormData,
} from "../helper";
const mainPath = "/groups/3d-tasks";

export default {
  get_all_model_tasks: async (groupId: string, payload?: any) => {
    return apiGetData(`${mainPath}/group/${groupId}?`, payload);
  },
  get_Model_task: async (taskId: string) => {
    return apiGetData(`${mainPath}/${taskId}?`);
  },
  create_Model_task: async (payload: any) => {
    return apiPostData(`${mainPath}`, payload);
  },
  delete_Model_task: async (taskId: string) => {
    return apiDeleteData(`${mainPath}/${taskId}?`);
  },
  edit_Model_task: async (taskId: string, payload: any) => {
    return apiPutData(`${mainPath}/${taskId}?`, payload);
  },
};
