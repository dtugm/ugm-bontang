import { defineStore } from "pinia";
import buildingSurveyApi from "../app/api/buildingSurvey.api";
export const useSurveyBuilding = defineStore("surveyBuilding", () => {
  const postBidangTanahBontangBaru = async (payload: any) => {
    const appStore = useAppStore();
    try {
      const formData = new FormData();

      formData.append("images", payload.images);
      formData.append("data", JSON.stringify(payload.data));
      await buildingSurveyApi.post_building_survey_monitorings(formData);

      appStore.toastSuccess("Add Data Berhasil!");
    } catch (error: any) {
      appStore.toastError(error.message);
    }
  };
  return {
    postBidangTanahBontangBaru,
  };
});
