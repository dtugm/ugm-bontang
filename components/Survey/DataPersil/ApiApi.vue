<template>
  <v-container>
    <v-row>
      <v-col lg="5">
        <AppInputAutocomplete label="Status" is-filter hide-details clearable />
      </v-col>
      <v-spacer></v-spacer>
      <v-btn class="text-none" color="tertiary">Add Data</v-btn>
    </v-row>
    <v-row no-gutters class="items-center gap-4 pt-3">
      <AppTextH5 color="primary"> Survey Api Api</AppTextH5>
      <div class="flex gap-2">
        <v-btn class="text-none" variant="outlined" color="success"
          >Bulk Add</v-btn
        >
      </div>
      <v-spacer></v-spacer>

      <v-col lg="3">
        <v-text-field
          append-inner-icon="mdi-magnify"
          placeholder="Search..."
          density="compact"
          clearable
          hide-details
        />
      </v-col>
    </v-row>
    <v-data-table
      :items="filteredData"
      :headers="SurveyDataConstant.surveyPbbHeader"
      show-select
    >
    </v-data-table>
  </v-container>
</template>
<script setup>
import SurveyDataConstant from "~/app/constant/SurveyData.constant";

const surveyStore = useSurveyDataStore();
surveyStore.getDataPersil("api_api", { district: "Api-Api" });
const search = ref("");
const filteredData = computed(() => {
  if (search.value) {
    return surveyStore.data_persil_api_api.filter((item) =>
      item.fid.toString().includes(search.value.toString())
    );
  } else {
    return surveyStore.data_persil_api_api;
  }
});
</script>
