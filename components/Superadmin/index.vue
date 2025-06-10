<template>
  <AppTableData :read-data="landParcelStore.readVectorsLandParcel">
    <template #item.action="{ item }">
      <div class="flex items-center">
        <v-switch
          color="success"
          inset
          hide-details
          v-model="item.isActive"
          @update:model-value="updateStatusVector(item)"
        ></v-switch>
      </div>
    </template>
  </AppTableData>
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
const landParcelStore = useLandVectors();
const landDataStore = useLandDataStore();
const userStore = useUsersStore();
const buildingStore = useBuildingDataStore();
userStore.getUsersList();
landParcelStore.getLandParcel({ category: "land_parcel" });
const updateStatusVector = async (item: IVectorsItems) => {
  await landParcelStore.updateVectorsStatus(item.id, {
    ...item,
  });
};
</script>
