<template>
  <div class="absolute bottom-1 right-1 z-10 mt-4">
    <v-card
      v-if="useLotSurveyMonitoringStore.popUpParcel"
      title="Land Parcel Detail"
      class="rounded-lg"
      max-height="900"
      width="450"
    >
      <template v-slot:append>
        <AppButtonIcon icon="mdi-pencil" @click="openEdit(rawValue)" />
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
            {{ value.imageUrls }}
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

      <v-card-text class="overflow-y-auto max-h-[500px] pb-20">
        <AppTableHorizontal
          :headers="landParcelViewerConstant.detailLandParcelHeader"
          :values="value"
          :loading="useLotSurveyMonitoringStore.attrLoading"
        />
      </v-card-text>
    </v-card>
  </div>
  <AppDialogConfirm
    :confirm-loading="lotSurveyStore.editPersilLoading"
    v-model="editDialog"
    confirm-color="tertiary"
    confirm-text="Update"
    @close="editDialog = false"
    @confirm="confirmEdit"
    width="900"
  >
    <v-row v-if="selectedItem">
      <v-col cols="6">
        <!-- <AppInputText label="NOP" v-model="selectedItem.taxObjectNumber" /> -->
        <AppInputText label="NIB" v-model="selectedItem.nib" />
        <AppInputText label="NOP" v-model="selectedItem.taxObjectNumber" />
        <AppInputText label="Alamat" v-model="selectedItem.taxObjectAddress" />
        <AppInputText label="Jenis Hak" v-model="selectedItem.typeOfRight" />
        <AppInputText
          label="Nama Pemilik"
          v-model="selectedItem.taxPayerName"
        />
        <v-row>
          <v-col>
            <AppInputText
              label="Luas Bumi (m²)"
              v-model="selectedItem.l_bumi"
              type="number"
            />
          </v-col>
          <v-col>
            <AppInputText
              label="Luas Tertulis (m²)"
              v-model="selectedItem.l_tertul"
              type="number"
            />
          </v-col>
        </v-row>
        <AppInputAutocomplete
          label="Jenis Tanah"
          :items="lotSurveyStore.landTypeOptions"
          v-model="selectedItem.landType"
        />
        <AppInputAutocomplete
          label="STAWPOP"
          :items="lotSurveyStore.staWpopOptions"
          v-model="selectedItem.staWpop"
        />
        <v-row>
          <v-col cols="4">
            <AppInputText label="RT" v-model="selectedItem.rt" type="number" />
          </v-col>
          <v-col>
            <AppInputAutocomplete
              label="Kelurahan"
              :items="lotSurveyStore.kelurahanOption"
              v-model="selectedItem.village"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <AppInputText
              label="Longitude"
              placeholder="117.492109"
              v-model="selectedItem.longitude"
              type="number"
            />
          </v-col>
          <v-col>
            <AppInputText
              label="Latitude"
              placeholder="0.13754"
              v-model="selectedItem.latitude"
              type="number"
            />
          </v-col>
        </v-row>
        <AppInputText label="UUID Persil" v-model="selectedItem.fid" />
      </v-col>
      <v-col cols="6">
        <AppInputFileIBoxV2
          file-type="img"
          v-model="imageForm"
          :preview_img="selectedItem?.imageUrls[0]"
        />
      </v-col>
    </v-row>
  </AppDialogConfirm>
</template>
<script lang="ts" setup>
import landParcelViewerConstant from "~/app/constant/view/landParcelViewer.constant";
import { STAWPOP } from "~/app/types/enums/landParcel";
function applyMapping(
  obj: Record<string, any>,
  mappings: Record<string, Record<string, string>>,
  fieldsWithM2: string[] = []
) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      let newValue = mappings[key]?.[value] ?? value;

      if (
        fieldsWithM2.includes(key) &&
        newValue !== null &&
        newValue !== undefined
      ) {
        // Pastikan angka
        const num = Number(newValue);
        if (!isNaN(num)) {
          // Batasi maksimal 5 angka di belakang koma tanpa nol berlebih
          newValue = `${parseFloat(num.toFixed(5))} m²`;
        } else {
          newValue = `${newValue} m²`; // kalau bukan angka, tambahkan m² apa adanya
        }
      }

      return [key, newValue];
    })
  );
}
const labelMappings = {
  staWpop: STAWPOP,
};
const useLotSurveyMonitoringStore = useLotSurveyMonitoring();
const value: any = computed(() => {
  const data: any = useLotSurveyMonitoringStore.parcelAtribute;
  return applyMapping(data, labelMappings, ["l_bumi", "l_tertul"]);
});
const rawValue: any = computed(() => {
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
const cleanItem: any = (obj: any) => {
  if (Array.isArray(obj)) {
    return obj.map((val) => cleanItem(val));
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [key, cleanItem(val)])
    );
  } else {
    return obj === "-" ? null : obj;
  }
};
const editDialog = ref(false);
const selectedItem = ref<ILotSurveyItems>();
const lotSurveyStore = useLotSurveyMonitoring();
const openEdit = (item: ILotSurveyItems) => {
  const cleanedItem = cleanItem(item);
  editDialog.value = true;
  selectedItem.value = cleanedItem;
};
const imageForm = ref(null);
const confirmEdit = async () => {
  if (selectedItem.value) {
    const { id, fid, createdAt, updatedAt, ...itemPayload } =
      selectedItem.value;
    await lotSurveyStore.editPersil(selectedItem.value.id, {
      data: {
        ...itemPayload,
        fid: fid,
      },
      images: imageForm.value,
    });
    await useLotSurveyMonitoringStore.getDetailPersil(fid);
  }
  editDialog.value = false;
  imageForm.value = null;
};
</script>
