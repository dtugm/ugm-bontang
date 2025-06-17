<template>
  <v-container>
    <v-btn color="primary" @click="uploadBulkDataAsync(500)"> Submit </v-btn>
    <v-file-input
      label="Upload GeoJSON"
      accept=".geojson,application/json"
      @change="handleFileUpload"
    ></v-file-input>

    <v-file-input
      v-model="images"
      label="Upload Gambar"
      accept="image/*"
      multiple
      @change="handleImagesUpload"
    ></v-file-input>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mt-4"
    ></v-progress-linear>

    <v-alert v-if="successMessage" type="success" class="mt-4">
      {{ successMessage }}
    </v-alert>
  </v-container>
  <!-- <DashboardStakeHolder /> -->
  <!-- <DashboardLapangan /> -->
</template>

<script>
import buildingSurveyApi from "../app/api/buildingSurvey.api";
import surveyApi from "~/app/api/survey.api";
import kodeConstant from "~/app/constant/kode.constant";
import SurveyLapanganConstant from "~/app/constant/SurveyLapangan.constant";
import { mapStores } from "pinia";
import lotSurveyApi from "~/app/api/lotSurvey.api";
export default {
  data() {
    return {
      geoJsonData: null,
      propertiesArray: [], // New array to store all properties
      images: [],
    };
  },
  computed: {
    ...mapStores(useBuildingDataStore),
    displayProperties() {
      if (!this.geoJsonData) return null;
      if (
        this.geoJsonData.type === "FeatureCollection" &&
        this.geoJsonData.features?.length > 0
      ) {
        return JSON.stringify(this.geoJsonData.features[0].properties, null, 2);
      }
      if (this.geoJsonData.type === "Feature") {
        return JSON.stringify(this.geoJsonData.properties, null, 2);
      }
      return "No properties found in this GeoJSON.";
    },
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          this.geoJsonData = JSON.parse(e.target.result);
          console.log("GeoJSON data loaded:", this.geoJsonData);
          this.extractPropertiesArray();
        } catch (error) {
          console.error("Error parsing GeoJSON:", error);
          alert("Invalid GeoJSON file");
        }
      };
      reader.readAsText(file);
    },
    handleImagesUpload(files) {
      console.log(this.images);
    },

    extractPropertiesArray() {
      this.propertiesArray = [];
      if (
        this.geoJsonData.type === "FeatureCollection" &&
        this.geoJsonData.features?.length > 0
      ) {
        this.propertiesArray = this.geoJsonData.features.map(
          (feature) => feature.properties
        );
      } else if (this.geoJsonData.type === "Feature") {
        this.propertiesArray = [this.geoJsonData.properties];
      }

      console.log("Properties array created:", this.propertiesArray);
    },
    async uploadBulkData() {
      let count = 0;
      const data = [];

      for (const feature of this.propertiesArray) {
        const floorValue = feature.JML_LANTAI;
        const fileName = (feature?.FOTO_WWC || "").split("/").pop();
        const matchedImage = this.images.find((img) => img.name === fileName);
        const payloadBgn = {
          images: matchedImage ?? null,
          data: {
            fid: feature.UUID,
            province: "Kalimantan Timur",
            city: "Bontang",
            district: "Bontang Utara",
            village: "Bontang Baru",
            status: kodeConstant.UPDATE[feature.UPDATE] ?? null,
            buildingUpdate: kodeConstant.UPDATE[feature.UPDATE] ?? null,
            floorCount:
              floorValue == null || Number(floorValue) === 0
                ? null
                : Number(floorValue),
            address: feature.ALAMAT_BGN,
            taxObjectNumber: feature.NOP,
            newTaxObjectNumber: feature.NOP_BARU,
          },
        };
        const payloadParcel = {
          images: matchedImage ?? null,
          data: {
            fid: feature.UUID,
            province: "Kalimantan Timur",
            city: "Bontang",
            district: "Bontang Utara",
            village: "Bontang Baru",
            taxObjectAddress: feature.ALAMAT_OP,
            taxPayerName: feature.NAMA_WP,
            citizenId: feature.NIK,
            buildingTotal: feature.JML_BGN,
            rt: feature.RT,
            rw: feature.RW,
            taxObjectNumber: feature.NOP,
            newTaxObjectNumber: feature.NOP_BARU,
          },
        };
        data.push(payloadParcel);
        // await this.buildingDataStore.uploadBuildingData(pyld);

        if (matchedImage) {
          count++;
        }
      }
      console.log(data);
      console.log(`Proses selesai. Total data yang cocok: ${count}`);
    },

    async uploadBulkDataAsync(batchSize = 10) {
      const totalItems = this.propertiesArray.length;
      console.log(`Total data: ${totalItems}`);
      for (let i = 0; i < totalItems; i += batchSize) {
        const batch = this.propertiesArray.slice(i, i + batchSize);

        const uploadPromises = batch.map(async (feature) => {
          try {
            const floorValue = feature.JML_LANTAI;
            const fileName = (feature?.FOTO_WWC || "").split("/").pop();
            const matchedImage = this.images.find(
              (img) => img.name === fileName
            );
            const payloadParcel = {
              images: matchedImage ?? null,
              data: {
                fid: feature.UUID,
                province: "Kalimantan Timur",
                city: "Bontang",
                district: "Bontang Utara",
                village: "Bontang Baru",
                taxObjectAddress: feature.ALAMAT_OP,
                taxPayerName: feature.NAMA_WP,
                citizenId: feature.NIK_WP,
                status:
                  SurveyLapanganConstant.statusMapAngka[
                    Number(feature.KODE_WWC)
                  ] ?? null,
                buildingTotal: feature.JML_BGN,
                rt: feature.RT,
                rw: feature.RW,
                phoneNumber1: feature.NOHP_WP,
                phoneNumber2: feature.NOHP_UPDT,
                taxObjectNumber: feature.NOP,
                newTaxObjectNumber: feature.NOP_BARU,
                rigthNumber: feature.NOMOR_HAK,
                l_bumi: feature.L_BUMI,
                l_tertul: feature.LUASTERTUL,
                nib: feature.NIB,
                landType: feature.JENIS_TNH,
                twoWheelVehicleTotal: feature.JML_KDR2,
                fourWheelVehicleTotal: feature.JML_KDR4,
                ketSrtf: feature.KET_SRTF,
              },
            };
            // const payload = {
            //   images: matchedImage ?? null,
            //   data: {
            //     fid: feature.UUID,
            //     uuid_bgn: feature.UUID,
            //     province: "Kalimantan Timur",
            //     city: "Bontang",
            //     district: "Bontang Utara",
            //     village: "Bontang Baru",
            //     // status: kodeConstant.UPDATE[feature.UPDATE] ?? null,
            //     buildingUpdate: kodeConstant.UPDATE[feature.UPDATE] ?? null,
            //     floorCount:
            //       floorValue == null || Number(floorValue) === 0
            //         ? null
            //         : Number(floorValue),
            //     address: feature.ALAMAT_BGN,
            //     taxObjectNumber: feature.NOP,
            //     newTaxObjectNumber: feature.NOP_BARU,
            //   },
            // };

            // await this.buildingDataStore.uploadBuildingData(payload);
            await lotSurveyApi.post_lot_survey_monitorings(payloadParcel);
          } catch (error) {
            console.error("Gagal upload data:", error);
          }
        });

        await Promise.all(uploadPromises);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    },
    async processBulkUpload() {
      console.log(this.propertiesArray);
      console.log(this.images);
      let count;
      for (const feature of this.propertiesArray) {
        const fileName = (feature?.F_WWC || "").split("/").pop();
        const matchedImage = this.images.find((img) => img.name === fileName);
        if (matchedImage) {
          console.log(feature);
          const payload = {
            images: matchedImage,
            data: {
              polygonId: feature.ID,
              fid: feature.UUID_PRSL,
              province: "Kalimantan Timur",
              city: "Bontang",
              district: "Bontang Baru",
              village: "Bontang Utara",
              status: "ACCURATE",
              ownerType: "NON_GOVERNMENT_AREA",
              // floorCount: feature.JML_LANTAI,
              taxObjectNumber: "-",
              taxObjectAddress: "-",
              // citizenId: null,
              taxPayerAddress: "-",
              taxPayerName: "-",
              // buildingTotal: null,
              // buildingFloorTotal: null,
              // wallType: null,
              // vehicleTotal: null,
              createdAt: "2025-04-18T06:08:56.919Z",
              updatedAt: "2025-04-18T06:08:56.919Z",
            },
          };
          console.log("cocok", matchedImage);
          console.log("first", payload);
          const formData = new FormData();
          formData.append("images", payload.images);
          formData.append("data", JSON.stringify(payload.data));
          try {
            await surveyApi.post_lot_survey_monitorings(formData);
          } catch (error) {
            console.log("Gagal mengirim data, harus update");

            continue;
          }
          continue;
        }
        if (!matchedImage) {
          console.warn(`No matching image for ${fileName}`);
          continue;
        }

        // formData.append("geojsonFeature", JSON.stringify(feature));
        // formData.append("image", matchedImage);

        // try {
        //   await axios.post("https://your-api-url.com/submit", formData);
        // } catch (err) {
        //   console.error(`Error uploading ${fileName}:`, err);
        // }
      }
    },
  },
};
</script>
