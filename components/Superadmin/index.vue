<template>
  <AppCardViewerDetail
    :title="'Detail User'"
    :value="{
      name: 'Dhias Naufal',
      email: 'dhias@example.com',
      phone: '08123456789',
    }"
  />
  <SuperadminVectors />
  <AppTableBasic
    :items="userStore.usersList"
    :headers="usersListHeader"
    title="List User"
  />

  <AppTableBasic
    :items="tiles3d.tiles3dItems"
    :headers="tiles3dHeaders"
    title="3D Tiles List"
  />

  <v-divider></v-divider>
  <AppTableData :read-data="landDataStore.readLotSurveyData" />
  <AppTableData :read-data="buildingStore.readLotSurveyData" />
</template>
<script setup lang="ts">
const tiles3d = use3dTilesStore();
tiles3d.getAll3dTiles();

const testData = {
  ConstructionMethod: "New Building",
  Height: 5.72881825478971,
  IsLandmarked: "NO",
  Latitude: 0.13921132299725508,
  Longitude: 117.50107428258596,
  TerrainHeight: 55.969894448031056,
};
const tiles3dHeaders = [
  { title: "No", key: "no" },
  { title: "Name", key: "name" },
  { title: "Status", key: "status" },
  { title: "Category", key: "category" },
  { title: "File", key: "file" },
  { title: "Actions", key: "action" },
];

const usersListHeader = [
  { title: "No", key: "no" },
  { title: "Email", key: "email" },
  { title: "First Name", key: "firstName" },
  { title: "Last Name", key: "lastName" },
  { title: "ID Organisasi", key: "organizationId" },
  { title: "Organisasi Name", key: "organizationName" },
  { title: "Role", key: "role" },
];

const landDataStore = useLandDataStore();
const userStore = useUsersStore();
const buildingStore = useBuildingDataStore();
userStore.getUsersList();
</script>
