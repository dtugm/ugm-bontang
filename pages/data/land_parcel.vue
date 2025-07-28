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
          label="Add"
          @click="landParcelStore.createData.openDialog"
        />
        <AppButton color="tertiary" label="Bulk Add" />
      </div>
    </template>
    <template #item.action>
      <div>
        <AppButtonIcon icon="mdi-pencil" />
        <AppButtonIcon icon="mdi-delete" />
      </div>
    </template>
  </AppTableData>
  <AppDialogForm
    title="Add Activity"
    submit-text="Save"
    :basic-form-dialog="landParcelStore.createData"
    :basic-form-inputs="landParcelStore.createFormInputs"
    @submit="landParcelStore.createData.submit"
  />
</template>
<script lang="ts" setup>
const landParcelStore = useLandParcelStore();
</script>
