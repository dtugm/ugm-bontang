import {
  apiDeleteData,
  apiGetData,
  apiPostData,
  apiPutData,
  CustomFormData,
} from "../helper";
const mainPath = "/groups/lidar-tasks";

export default {
  get_all_lidar_tasks: async (groupId: string, payload?: any) => {
    return apiGetData(`${mainPath}/group/${groupId}?`, payload);
  },
  get_lidar_task: async (taskId: string) => {
    return apiGetData(`${mainPath}/${taskId}?`);
  },
  create_lidar_task: async (payload: ICreateLidarTask) => {
    return apiPostData(`${mainPath}`, payload);
  },
};
