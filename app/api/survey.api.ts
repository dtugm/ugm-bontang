import {
  apiDeleteData,
  apiGetData,
  apiPostData,
  apiPutData,
  CustomFormData,
} from "../helper";
const mainPath = "/lot-survey-monitorings";

export default {
  lot_survey_monitorings: async (payload?: any) => {
    return apiGetData(`${mainPath}?`, payload);
  },
  get_persil_by_fid: async (fid?: any) => {
    return apiGetData(`${mainPath}/by-fid/${fid}`);
  },
  lot_survey_monitorings_summary: async (payload?: any) => {
    return apiGetData(`${mainPath}/summary`, payload);
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
  delete_lot_survey_monitorings: async (id: string) => {
    return apiDeleteData(`${mainPath}/${id}`, {
      "Content-Type": "multipart/form-data",
    });
  },
};
