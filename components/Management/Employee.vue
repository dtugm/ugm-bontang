<template>
  <div class="min-h-screen">
    <v-container fluid class="h-full">
      <v-row>
        <AppButton
          label="Checkout all"
          color="error"
          @click="checkOutDialog = true"
        ></AppButton>
      </v-row>
      <v-row>
        <v-col
          cols="4"
          v-for="(item, index) in appMock.employee"
          :key="item.id"
        >
          <v-card
            :title="item.name"
            :subtitle="item.email"
            prepend-avatar="/logo/HD-wallpaper-squid-game-worker-art.jpg"
          >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                variant="elevated"
                class="text-none"
                color="primary"
                @click="addTask(item)"
                >Add New Task</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <AppDialog fullscreen v-model="employeeBO" :title="selectedEmployee?.name">
    <v-card-text>
      <LazyManagementEmployeeInformation
        :selected-employee="selectedEmployee"
      />
    </v-card-text>
  </AppDialog>

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
import petaGarisMock from "~/app/mock/petaGaris.mock";
import appMock from "~/app/mock/app.mock";
const checkOutDialog = ref(false);
const idEmployee = appMock.employee_uid;
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
const employeeBO = ref(false);
const addTaskDialog = ref(false);
const selectedEmployee: any = ref({});
const addTask = (item: any) => {
  selectedEmployee.value = item;
  employeeBO.value = true;
};
</script>
