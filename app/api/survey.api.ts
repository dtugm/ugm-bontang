import { apiGetData, apiPostData, CustomFormData } from "../helper";
const mainPath = "/lot-survey-monitorings";

export default {
  lot_survey_monitorings: async () => {
    return apiGetData(`${mainPath}?`);
  },
  post_lot_survey_monitorings: async (payload: any) => {
    return apiPostData(`${mainPath}`, payload);
  },
};
