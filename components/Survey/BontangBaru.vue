<template>
  <v-data-table :items="filteredData" :headers="fidHeaders"></v-data-table>
</template>
<script setup>
const surveyStore = useSurveyDataStore();
const fidHeaders = [
  {
    title: "fid",
    value: "fid",
  },
  {
    title: "id",
    value: "id",
  },
];
surveyStore.getAllPersilData();
const search = ref("");
const filteredData = computed(() => {
  if (search.value) {
    return surveyStore.allPersilData.filter((item) =>
      item.fid.toString().includes(search.value.toString())
    );
  } else {
    return surveyStore.allPersilData;
  }
});
</script>
