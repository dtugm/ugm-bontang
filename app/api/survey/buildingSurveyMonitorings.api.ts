import {
  apiGetData,
  apiUpdateWithStructuredPayload,
  apiUploadWithStructuredPayload,
  buildPath,
  apiDeleteData,
} from "~/app/axios/axiosBearer";

const mainPath = "/building-survey-monitorings";

export default {
  get_building_survey_monitoring: async () => {
    return apiGetData(`${mainPath}`);
  },
  create_building_survey_monitoring: async (payload: any) => {
    return apiUploadWithStructuredPayload(`${mainPath}`, payload);
  },
  get_building_survey_administrative: async (
    path: IGetSummaryLotByAdministrative
  ) => {
    const customPath = buildPath(
      `${mainPath}/summary/{administrativeLevel}`,
      path
    );
    return apiGetData(customPath);
  },
  get_building_survey_by_fid: async (path: IGetBuildingSurveyByFid) => {
    const customPath = buildPath(`${mainPath}/by-fid/{fid}`, path);
    return apiGetData(customPath);
  },
  get_building_survey_by_uuid: async (path: IGetBuildingSurveyByUuid) => {
    const customPath = buildPath(`${mainPath}/by-uuid-bgn/{uuidBgn}`, path);
    return apiGetData(customPath);
  },
  get_building_survey_complete: async (path: IGetBuildingSurveyByFid) => {
    const customPath = buildPath(`${mainPath}/complete-data/{fid}`, path);
    return apiGetData(customPath);
  },
  get_building_survey_by_id: async (path: IPathId) => {
    const customPath = buildPath(`${mainPath}/{id}`, path);
    return apiGetData(customPath);
  },

  update_building_survey_monitoring: async (path: IPathId, payload: any) => {
    const customPath = buildPath(`${mainPath}/{id}`, path);
    return apiUpdateWithStructuredPayload(customPath, payload);
  },

  delete_building_survey_monitoring: async (path: IPathId) => {
    const customPath = buildPath(`${mainPath}/{id}`, path);
    return apiDeleteData(customPath);
  },
};
