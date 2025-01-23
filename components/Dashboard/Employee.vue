<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <template #title>
            Selamat Datang kembali,
            <span class="text-primary font-bold">
              {{
                authStore.user?.displayName
                  ? authStore.user?.displayName
                  : authStore.user?.email
              }}
            </span>
            <v-chip
              class="ml-1"
              :color="employeeStatus?.status ? 'success' : 'error'"
              >{{
                employeeStatus?.status ? "Checked In" : "Checked Out"
              }}</v-chip
            >
          </template>
          <template #subtitle>
            <p>Hari ini, {{ appStore.currentDate }}</p>
          </template>
          <template #text>
            <div class="flex gap-2">
              <AppButton
                color="success"
                append-icon="mdi-login"
                label="Check In"
                @click="checkInDialog = true"
              />
              <AppButton
                variant="outlined"
                color="error"
                append-icon="mdi-logout"
                label="Check Out"
                @click="handleCheckOut"
              />
            </div>
            <p class="text-text text-md mt-1">Office Hour (08.30 - 17.00)</p>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row> </v-row>
  </v-container>
  <AppDialog v-model="checkInDialog" width="500">
    <v-form
      id="presensiForm"
      ref="formRef"
      @submit.prevent="handleSubmitCheckIn()"
    >
      <v-card-text>
        <AppInputAutocomplete
          v-model="work_type"
          is-filter
          hide-details
          label="Cara Bekerja"
          :items="['Work Form Office', 'Work From Home']"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <AppButton
          label="Cancel"
          color="info"
          variant="outlined"
          @click="checkInDialog = false"
        />
        <AppButton
          form="presensiForm"
          label="Check In"
          color="success"
          type="submit"
        />
      </v-card-actions>
    </v-form>
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
<script lang="ts" setup>
import { collection, doc, setDoc } from "firebase/firestore";
const db = useFirestore();
const authStore = useAuthStore();
const appStore = useAppStore();
const employeeStore = useEmployeeStore();
const work_type = ref();
const checkInDialog = ref(false);
const employeeStatus: any = useDocument(
  doc(collection(db, "attendance"), authStore.user?.uid)
);
const presensiText = () => {
  return employeeStatus?.status ? "Checked In" : "Checked Out";
};
const presensiColor = () => {
  return employeeStatus?.status ? "success" : "error";
};
const handleSubmitCheckIn = async () => {
  const payload = {
    work_type: work_type.value,
    status: true,
  };
  await employeeStore
    .updateAttendance("check_in_time", authStore.user?.uid, payload)
    .then(() => {
      checkInDialog.value = false;
    });
};
const checkOutDialog = ref(false);
const handleCheckOut = () => {
  checkOutDialog.value = true;
};
const handleSubmitCheckOut = async () => {
  const payload = {
    status: false,
  };
  await employeeStore
    .updateAttendance("check_out_time", authStore.user?.uid, payload)
    .then(() => {
      checkOutDialog.value = false;
    });
};
</script>
