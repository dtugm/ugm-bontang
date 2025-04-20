<template>
  <v-container>
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

    <v-btn color="primary" @click="processBulkUpload"> Submit </v-btn>

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
  <DashboardStakeHolder />
  <!-- <DashboardLapangan /> -->
</template>

<script>
export default {
  data() {
    return {
      geoJsonData: null,
      propertiesArray: [], // New array to store all properties
      images: [],
    };
  },
  computed: {
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

    async processBulkUpload() {
      console.log(this.propertiesArray);
      console.log(this.images);
      for (const feature of this.propertiesArray) {
        const fileName = (feature?.F_WWC || "").split("/").pop();
        const matchedImage = this.images.find((img) => img.name === fileName);
        if (matchedImage) {
          console.log(feature);
          const payload = {
            images: matchedImage,
            data: {
              polygonId: feature.ID,
              fid: feature.FID,
              province: "Kalimantan Timur",
              city: "Bontang",
              district: "Bontang Baru",
              village: "Bontang Utara",
              taxObjectAddress: feature.FID,
              taxPayerName: feature.FID,
              status: "OWNER_CANNOT_BE_MEET",
              ownerType: "NON_GOVERNMENT_AREA",
              taxObjectNumber: null,
              citizenId: null,
              taxPayerAddress: null,
              taxPayerPhone: null,
              buildingTotal: null,
              buildingFloorTotal: null,
              wallType: null,
              vehicleTotal: null,
              createdAt: "2025-04-18T06:08:56.919Z",
              updatedAt: "2025-04-18T06:08:56.919Z",
            },
          };
          console.log(matchedImage);
          continue;
        }
        if (!matchedImage) {
          console.warn(`No matching image for ${fileName}`);
          continue;
        }

        // const formData = new FormData();
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
