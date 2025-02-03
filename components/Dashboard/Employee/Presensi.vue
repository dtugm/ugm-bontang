<template>
  <v-card class="h-full" variant="flat">
    <template v-slot:append>
      <v-chip :color="presensiColor()">{{ presensiText() }}</v-chip>
    </template>
    <template #title>
      Hi,
      <span class="text-primary font-bold">
        {{
          authStore.user?.displayName
            ? authStore.user?.displayName
            : authStore.user?.email
        }}
      </span>
    </template>
    <template #subtitle>
      <p>Hari ini, {{ appStore.currentDate() }}</p>
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
          @click="checkOutDialog = true"
        />
        <AppButton label="Izin" color="primary" @click="izinDialog = true" />
      </div>
      <!-- <p class="text-text text-md mt-1">Office Hour (08.30 - 17.00)</p> -->
    </template>
  </v-card>
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
  <AppDialog v-model="izinDialog" width="500">
    <v-form id="izinForm" ref="formRef" @submit.prevent="handleIzin()">
      <v-card-text>
        <AppInputAutocomplete
          v-model="izin_type"
          is-filter
          hide-details
          label="Alasan Izin"
          :items="['Sakit', 'Izin']"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <AppButton
          label="Cancel"
          color="info"
          variant="outlined"
          @click="izinDialog = false"
        />
        <AppButton form="izinForm" label="Izin" color="primary" type="submit" />
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
import { collection, doc } from "firebase/firestore";
import { useDocument, useFirestore } from "vuefire";
const db = useFirestore();
const authStore = useAuthStore();
const appStore = useAppStore();
const employeeStore = useEmployeeStore();
const userInfo = {
  user_id: authStore.user?.uid,
  user_name: authStore.user?.displayName,
  user_email: authStore.user?.email,
};
const work_type = ref();
const izin_type = ref();
const checkInDialog = ref(false);
const izinDialog = ref(false);
const employeeStatus: any = useDocument(
  doc(collection(db, "employee"), authStore.user?.uid)
);
const presensiText = () => {
  return employeeStatus.value?.status ? "Checked In" : "Checked Out";
};
const presensiColor = () => {
  return employeeStatus.value?.status ? "success" : "error";
};
const handleSubmitCheckIn = async () => {
  const payload = {
    work_type: work_type.value,
    status: true,
    statusKerja: true,
  };
  await employeeStore
    .updateAttendance(userInfo, "check_in_time", authStore.user?.uid, payload)
    .then(() => {
      checkInDialog.value = false;
    });
};
const checkOutDialog = ref(false);
const handleSubmitCheckOut = async () => {
  const payload = {
    status: false,
    statusKerja: true,
  };
  await employeeStore
    .updateAttendance(userInfo, "check_out_time", authStore.user?.uid, payload)
    .then(() => {
      checkOutDialog.value = false;
    });
};
const handleIzin = async () => {
  const payload = {
    izin_type: izin_type.value,
    status: false,
    statusKerja: false,
  };
  await employeeStore
    .updateAttendance(userInfo, "izin_time", authStore.user?.uid, payload)
    .then(() => {
      izinDialog.value = false;
    });
};
</script>
