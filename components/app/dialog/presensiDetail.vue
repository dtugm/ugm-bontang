<template>
  <AppDialog title="User Detail">
    <v-card-text v-if="selectedEmployee">
      <v-row class="mb-1">
        <v-col cols="6">
          <AppInputText
            label="User Name"
            v-model="selectedEmployee.user_name"
            hide-details
            readonly
          />
        </v-col>
        <v-col cols="6">
          <AppInputText
            label="User Email"
            v-model="selectedEmployee.user_email"
            hide-details
            readonly
          />
        </v-col>
        <v-col cols="6">
          <AppInputText
            label="Tempat Kerja"
            v-model="selectedEmployee.work_type"
            hide-details
            readonly
          />
        </v-col>
        <v-col cols="6">
          <AppInputText
            label="Waktu Masuk"
            v-model="selectedEmployee.check_in_time"
            hide-details
            readonly
          />
        </v-col>
        <v-col cols="6">
          <AppInputText
            label="Longitude"
            v-model="selectedEmployee.lng"
            hide-details
            readonly
          />
        </v-col>
        <v-col cols="6">
          <AppInputText
            label="Latitude"
            v-model="selectedEmployee.lat"
            hide-details
            readonly
          />
        </v-col>
      </v-row>
      <LMap
        v-if="selectedEmployee.lat"
        ref="map"
        style="height: 300px"
        :zoom="12"
        :center="[selectedEmployee.lat, selectedEmployee.lng]"
        :use-global-leaflet="false"
      >
        <!-- <LTileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          layer-type="base"
          name="Arcgis"
        /> -->
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="Arcgis"
        />
        <LFeatureGroup>
          <LMarker :lat-lng="[selectedEmployee.lat, selectedEmployee.lng]" />
        </LFeatureGroup>
      </LMap>
    </v-card-text>
  </AppDialog>
</template>
<script>
export default {
  props: {
    selectedEmployee: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
