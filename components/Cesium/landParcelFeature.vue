<template>
  <div class="absolute bottom-1 right-1 z-10 mt-4">
    <v-card
      v-if="useLotSurveyMonitoringStore.popUpParcel"
      title="Land Parcel Detail"
      class="rounded-lg"
      max-height="400"
      width="450"
    >
      <template v-slot:append>
        <v-menu :close-on-content-click="false" location="top" :offset="[0, 0]">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              class="text-none my-1"
              variant="flat"
              prepend-icon="mdi-file-image"
              >Image
            </v-btn>
          </template>
          <v-card
            min-width="300"
            max-height="400"
            title="Preview Image"
            class="rounded-lg"
          >
            <v-card-text v-if="hasImage">
              <v-img
                :src="value.imageUrls[0]"
                aspect-ratio="1.5"
                cover
                class="rounded"
                @error="onImageError"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                    ></v-progress-circular>
                  </div> </template
              ></v-img>
            </v-card-text>
            <v-card-text v-else class="text-center text-medium-emphasis">
              <div class="flex flex-col items-center">
                <v-icon size="200" color="tertiary"
                  >mdi-image-size-select-actual</v-icon
                >
                Gambar tidak tersedia
              </div>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-btn
          color="error"
          variant="flat"
          size="25"
          icon
          @click="useLotSurveyMonitoringStore.popUpParcel = false"
        >
          <v-icon size="15">mdi-close</v-icon>
        </v-btn>
      </template>
      <v-card-text class="overflow-y-auto max-h-[400px]">
        <AppTableHorizontal
          :headers="landParcelViewerConstant.detailLandParcelHeader"
          :values="value"
          :loading="useLotSurveyMonitoringStore.attrLoading"
        />
      </v-card-text>
    </v-card>
  </div>
</template>
<script lang="ts" setup>
import landParcelViewerConstant from "~/app/constant/view/landParcelViewer.constant";
const useLotSurveyMonitoringStore = useLotSurveyMonitoring();
const value: any = computed(() => {
  const data: any = useLotSurveyMonitoringStore.parcelAtribute;
  return data;
});
const imageSrc = ref(value.value.imageUrls?.[0] || "");
const imageFailed = ref(false);
watch(
  () => value.value.imageUrls?.[0],
  (newUrl) => {
    imageSrc.value = newUrl || "";
    imageFailed.value = false;
  },
  { immediate: true }
);
const hasImage = computed(() => {
  return imageSrc.value && !imageFailed.value;
});

function onImageError() {
  imageFailed.value = true;
}
</script>
