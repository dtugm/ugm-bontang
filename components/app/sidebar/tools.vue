<template>
  <v-list density="compact" nav>
    <v-list-item
      prepend-icon="mdi-refresh-circle"
      title="Refresh Map"
      value="refresh"
      @click="surveyStore.changeStatus()"
    >
      <template v-slot:append>
        <v-progress-circular
          v-if="surveyStore.refreshLoading"
          indeterminate
        ></v-progress-circular>
      </template>
    </v-list-item>
  </v-list>
</template>
<script setup>
const surveyStore = useSurveyStore();
</script>
