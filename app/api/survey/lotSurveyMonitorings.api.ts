import {
  apiGetData,
  apiUpdateWithStructuredPayload,
  apiUploadWithStructuredPayload,
  buildPath,
  apiDeleteData,
} from "~/app/axios/axiosBearer";

const mainPath = "/lot-survey-monitorings";

export default {
  get_lot_survey_monitoring: async () => {
    return apiGetData(`${mainPath}`);
  },
  create_lot_survey_monitoring: async (
    payload: ICreateLotSurveyMonitoringPayload
  ) => {
    return apiUploadWithStructuredPayload(`${mainPath}`, payload);
  },
  get_summary_lot_survey_administrative: async (
    path: IGetSummaryLotByAdministrative
  ) => {
    const customPath = buildPath(
      `${mainPath}/summary/{administrativeLevel}`,
      path
    );
    return apiGetData(customPath);
  },
  get_survey_by_fid: async (path: IGetLotSurveyByFid) => {
    const customPath = buildPath(`${mainPath}/by-fid/{fid}`, path);
    return apiGetData(customPath);
  },
  get_survey_by_id: async (path: IPathId) => {
    const customPath = buildPath(`${mainPath}/{id}`, path);
    return apiGetData(customPath);
  },

  update_lot_survey_monitoring: async (path: IPathId, payload: any) => {
    const customPath = buildPath(`${mainPath}/{id}`, path);
    return apiUpdateWithStructuredPayload(customPath, payload);
  },

  delete_lot_survey_monitoring: async (path: IPathId) => {
    const customPath = buildPath(`${mainPath}/{id}`, path);
    return apiDeleteData(customPath);
  },
};
