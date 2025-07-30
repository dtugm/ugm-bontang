<template>
  <DataLandParcelFilter />
  <AppTableData
    title="Data Survey Lapangan (Persil Tanah)"
    :read-data="landParcelStore.readLandParcel"
  >
    <template #action>
      <div class="flex gap-1">
        <AppButton
          variant="outlined"
          label="Add Land Parcel"
          @click="addLandParcel"
        />
      </div>
      <v-btn @click="testFunction()">Test</v-btn>
    </template>
    <template #item.action="{ item }">
      <div>
        <AppButtonIcon @click="previewImage(item)" icon="mdi-eye" />
        <AppButtonIcon icon="mdi-pencil" />
        <AppButtonIcon icon="mdi-delete" />
      </div>
    </template>
  </AppTableData>
  <AppDialog v-model="dialog">
    <v-img :src="imageUrlPreview"> </v-img>
  </AppDialog>
</template>
<script lang="ts" setup>
import buildingSurveyMonitoringsApi from "~/app/api/survey/buildingSurveyMonitorings.api";
const imageUrlPreview = ref();
const dialog = ref(false);
const previewImage = (item: any) => {
  dialog.value = true;
  imageUrlPreview.value = item.imageUrls[0];
};
const landParcelStore = useLandParcelStore();
const addLandParcel = () => {
  navigateTo("/data/add_land_parcel");
};
const testFunction = async () => {
  const resp =
    await buildingSurveyMonitoringsApi.get_building_survey_monitoring();
  console.log(resp);
};
</script>
