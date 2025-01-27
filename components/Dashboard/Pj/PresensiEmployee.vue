<template>
  <v-card>
    <v-card-text>
      Presensi Harian
      <v-list>
        <v-list-item
          lines="two"
          v-for="employee in employees"
          :key="employee.user_id"
          :value="employee.user_id"
          :subtitle="employee.work_type"
          :title="employee.user_email"
          @click="openDetail(employee)"
        >
          <template v-slot:append>
            <v-chip :color="employee.status ? 'success' : 'error'">
              {{ employee.status ? "ON" : "OFF" }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
  <AppDialog v-model="userDetail" title="User Detail">
    <v-card-text>
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
<script lang="ts" setup>
import { collection } from "firebase/firestore";
const db = useFirestore();
const userDetail = ref(false);
const employees = useCollection(collection(db, "attendance"));
const selectedEmployee: any = ref({});
const openDetail = (employee: any) => {
  userDetail.value = true;
  selectedEmployee.value = employee;
};
</script>
