import { apiDeleteData, apiGetData, apiPostData, apiPutData } from "../helper";
const mainPath = "/building-survey-monitorings";

export default {
  building_survey_monitorings: async (payload?: any) => {
    return apiGetData(`${mainPath}?`, payload);
  },
  post_building_survey_monitorings: async (payload: any) => {
    return apiPostData(`${mainPath}`, payload, {
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
