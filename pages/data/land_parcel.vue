<template>
  <DataLandParcelFilter />
  <AppTableData
    title="Data Survey Lapangan (Persil Tanah)"
    :read-data="landParcelStore.readLandParcel"
  >
    <template #action>
      <div class="flex gap-1">
        <AppButton
          variant="outlined"
          label="Add Land Parcel"
          @click="addLandParcel"
        />
      </div>
    </template>
    <template #item.action>
      <div>
        <AppButtonIcon icon="mdi-pencil" />
        <AppButtonIcon icon="mdi-delete" />
      </div>
    </template>
  </AppTableData>
</template>
<script lang="ts" setup>
const landParcelStore = useLandParcelStore();
const addLandParcel = () => {
  navigateTo("/data/add_land_parcel");
};
</script>
