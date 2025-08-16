import { defineStore } from "pinia";
import * as XLSX from "xlsx";
import buildingSurveyApi from "~/app/api/buildingSurvey.api";

export const useDataStore = defineStore("dataStore", () => {
  async function fetchAllBuildingSurveyData(
    filters: Record<string, any> = {},
    pageSize = 500
  ) {
    let page = 1;
    let allData: any[] = [];
    let maxPage = 1;

    while (page <= maxPage) {
      const res = await buildingSurveyApi.building_survey_monitorings({
        ...filters,
        page,
        pageSize,
      });

      const rows = res?.data || [];
      allData.push(...rows);

      // update maxPage dari response supaya loop berhenti tepat
      maxPage = Number(res?.maxPage || 1);

      page++;
    }

    return allData;
  }
  async function exportBuildingSurveyExcel(filters: Record<string, any> = {}) {
    const allData = await fetchAllBuildingSurveyData(filters);

    const ws = XLSX.utils.json_to_sheet(allData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Survey Data");

    XLSX.writeFile(wb, "building_survey.xlsx");
  }
  return {
    fetchAllBuildingSurveyData,
    exportBuildingSurveyExcel,
  };
});
