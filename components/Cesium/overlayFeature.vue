<template>
  <div class="absolute bottom-1 right-1 z-10 mt-4">
    <v-card
      v-if="popUpBuilding"
      title="Building Detail"
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
          @click="tiles3dStore.popUpBuildingBuilding = false"
        >
          <v-icon size="15">mdi-close</v-icon>
        </v-btn>
      </template>

      <v-card-text class="overflow-y-auto max-h-[500px] pb-20">
        <AppTableHorizontal
          :headers="buildingViewerConstant.detailBuildingHeader"
          :values="value"
          :loading="tiles3dStore.attrLoading"
        />
      </v-card-text>
    </v-card>
  </div>
  <AppDialogConfirm
    :confirm-loading="buildingStore.editBuildingLoading"
    v-model="editDialog"
    confirm-color="tertiary"
    confirm-text="Update"
    @close="editDialog = false"
    @confirm="confirmEdit"
    width="1200"
  >
    <v-row v-if="selectedItem">
      <v-col cols="6">
        <AppInputText label="NOP" v-model="selectedItem.taxObjectNumber" />
        <AppInputText label="Alamat" v-model="selectedItem.address" />
        <AppInputText
          label="Nama Pemilik"
          v-model="selectedItem.taxPayerName"
        />
        <v-row>
          <v-col>
            <AppInputText
              label="Luas Bangunan Lama (m²)"
              v-model="selectedItem.luasBgnLama"
              type="number"
            />
          </v-col>
          <v-col>
            <AppInputText
              label="Luas Bangunan (m²)"
              v-model="selectedItem.luasBgn"
              type="number"
            />
          </v-col>
        </v-row>

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
              v-model="selectedItem.longBgn"
              type="number"
            />
          </v-col>

          <v-col>
            <AppInputText
              label="Latitude"
              placeholder="0.13754"
              v-model="selectedItem.latBgn"
              type="number"
            />
          </v-col>
        </v-row>
        <AppInputText label="UUID Bangunan" v-model="selectedItem.fid" />
        <v-row>
          <v-col cols="6">
            <AppInputAutocomplete
              :items="buildingStore.buildingUpdateOptions"
              label="Status Survey"
              v-model="selectedItem.update"
            />
          </v-col>
          <v-col>
            <AppInputAutocomplete
              :items="buildingStore.buildingTypeOptions"
              label="Tipe Bangunan"
              v-model="selectedItem.buildingType"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <AppInputAutocomplete
              :items="buildingStore.wallTypeOptions"
              label="Tipe Dinding"
              v-model="selectedItem.buildingWall"
            />
          </v-col>
          <v-col>
            <AppInputAutocomplete
              :items="buildingStore.buildingConstructionOptions"
              label="Tipe Konstruksi"
              v-model="selectedItem.buildingConstruction"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <AppInputAutocomplete
              :items="buildingStore.floorTypeOptions"
              label="Tipe Lantai"
              v-model="selectedItem.buildingFloorType"
            />
          </v-col>
          <v-col>
            <AppInputAutocomplete
              :items="buildingStore.roofTypeOptions"
              label="Tipe Roof"
              v-model="selectedItem.roofType"
            />
          </v-col>
        </v-row>
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
import buildingViewerConstant from "~/app/constant/view/buildingViewer.constant";
import {
  buildingTypeMap,
  wallTypeMap,
  buildingUpdateMap,
  buildingConstructionMap,
  floorTypeMap,
} from "~/app/constant/data/buildingMapping.constant";
const labelMappings = {
  update: buildingUpdateMap,
  buildingType: buildingTypeMap,
  buildingConstruction: buildingConstructionMap,
  buildingWall: wallTypeMap,
  buildingFloorType: floorTypeMap,
};

const tiles3dStore = use3dTilesStore();

const popUpBuilding: any = computed(() => {
  return tiles3dStore.popUpBuildingBuilding;
});

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

const value: any = computed(() => {
  const data: any = tiles3dStore.buildingAttribute;
  return applyMapping(data, labelMappings, ["luasBgn", "l_tertul"]);
});
const rawValue: any = computed(() => {
  const data: any = tiles3dStore.buildingAttribute;
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
const buildingStore = useBuildingDataStore();
const selectedItem: any = ref<IBuildingObjectType>();
const editDialog = ref(false);
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
    await buildingStore.editBuilding(selectedItem.value.id, {
      data: {
        ...itemPayload,
        fid: fid,
      },
      images: imageForm.value,
    });
    tiles3dStore.getDetailBuilding(fid);
  }

  editDialog.value = false;
  imageForm.value = null;
};

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

const lotSurveyStore = useLotSurveyMonitoring();
</script>
