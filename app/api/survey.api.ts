import { apiGetData, apiPostData, apiPutData, CustomFormData } from "../helper";
const mainPath = "/lot-survey-monitorings";

export default {
  lot_survey_monitorings: async (payload?: any) => {
    return apiGetData(`${mainPath}?`, payload);
  },
  post_lot_survey_monitorings: async (payload: any) => {
    return apiPostData(`${mainPath}`, payload, {
      "Content-Type": "multipart/form-data",
    });
  },
  put_lot_survey_monitorings: async (payload: any, id: string) => {
    return apiPutData(`${mainPath}/${id}`, payload, {
      "Content-Type": "multipart/form-data",
    });
  },
};
