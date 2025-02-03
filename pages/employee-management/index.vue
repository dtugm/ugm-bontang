<template>
  <div>
    <v-container fluid>
      <AppButton
        label="Checkout all"
        color="error"
        @click="checkOutDialog = true"
      ></AppButton>
    </v-container>
  </div>
  <AppDialog v-model="checkOutDialog" width="400">
    <v-card-text>
      <p class="text-text">
        Setelah Check Out anda Tidak Bisa Malukan Check in lagi untuk Hari ini
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <AppButton
        label="Cancel"
        color="info"
        variant="outlined"
        @click="checkOutDialog = false"
      />
      <AppButton
        label="Check Out"
        color="error"
        @click="handleSubmitCheckOut"
      />
    </v-card-actions>
  </AppDialog>
</template>
<script setup lang="ts">
const checkOutDialog = ref(false);
const idEmployee = [
  "HOwotiYND2gmUsOR6gK0HxMLyRa2",
  "SjET6hoq94VNoKXGlRqt3lageeu1",
  "jCB466erHcN6IduQBJo3LLIIkjy1",
];
const employeeStore = useEmployeeStore();
const handleSubmitCheckOut = async () => {
  idEmployee.forEach(async (id) => {
    const payload = {
      status: false,
      statusKerja: true,
    };
    await employeeStore.updateAttendanceByAdmin("check_out_time", id, payload);
  });
};
</script>
