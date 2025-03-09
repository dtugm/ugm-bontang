<template>
  <AppDialog title="LogBook Detail">
    <v-card-text v-if="selectedLog">
      <v-row class="mb-3">
        <v-col cols="12">
          <AppInputDatePicker
            v-model="selectedLog.date"
            label="Tanggal"
            :rules="[(value) => !!value || 'This field is required']"
            required
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <AppInputText v-model="selectedLog.pic" label="PIC" hide-details />
        </v-col>
        <v-col cols="6">
          <AppInputText v-model="selectedLog.team" label="Team" hide-details />
        </v-col>
        <v-col cols="4">
          <AppInputText
            v-model="selectedLog.kelurahan"
            label="Kelurahan"
            hide-details
          />
        </v-col>
        <v-col cols="4">
          <AppInputText
            v-model="selectedLog.kecamatan"
            label="Kecamatan"
            hide-details
          />
        </v-col>
        <v-col cols="4">
          <AppInputText v-model="selectedLog.rt" label="RT" hide-details />
        </v-col>
        <v-col cols="12">
          <AppInputText
            v-model="selectedLog.progress"
            label="Capaian"
            hide-details
          />
        </v-col>

        <v-col cols="12">
          <AppInputTextarea
            v-model="selectedLog.notes"
            label="Keterangan"
            hide-details
          />
        </v-col>
      </v-row>
      <LMap
        v-if="selectedLog.lat"
        ref="map"
        style="height: 300px"
        :zoom="12"
        :center="[selectedLog.lat, selectedLog.lng]"
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
          <LMarker :lat-lng="[selectedLog.lat, selectedLog.lng]" />
        </LFeatureGroup>
      </LMap>
    </v-card-text>
  </AppDialog>
</template>
<script>
export default {
  props: {
    selectedLog: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
