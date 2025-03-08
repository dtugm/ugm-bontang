import { apiGetData } from "../helper";
const mainPath = "/lot-survey-monitorings";

export default {
  lot_survey_monitorings: async (payload: ILoginPayload) => {
    return apiGetData(`${mainPath}?`, payload);
  },
};
