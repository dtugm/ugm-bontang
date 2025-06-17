import {
  apiDeleteData,
  apiGetData,
  apiPostData,
  apiPutData,
  objectToFormData,
} from "../helper";
const mainPath = "/building-survey-monitorings";

export default {
  building_survey_monitorings: async (payload?: any) => {
    return apiGetData(`${mainPath}?`, payload);
  },
  get_building_by_fid: async (fid?: any) => {
    return apiGetData(`${mainPath}/complete-data/${fid}`);
  },
  post_building_survey_monitorings: async (payload: any) => {
    const formData = new FormData();
    formData.append("images", payload.images);
    formData.append("data", JSON.stringify(payload.data));
    return apiPostData(`${mainPath}`, formData, {
      "Content-Type": "multipart/form-data",
    });
  },
  put_building_survey_monitorings: async (payload: any, id: string) => {
    return apiPutData(`${mainPath}/${id}`, payload, {
      "Content-Type": "multipart/form-data",
    });
  },
  delete_building_survey_monitorings: async (id: string) => {
    return apiDeleteData(`${mainPath}/${id}`, {
      "Content-Type": "multipart/form-data",
    });
  },
};
