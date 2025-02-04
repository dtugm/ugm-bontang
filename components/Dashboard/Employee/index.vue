<template>
  <v-container fluid class="h-full">
    <v-row>
      <v-col cols="12" sm="6">
        <DashboardEmployeePresensi />
      </v-col>
      <v-col cols="12" sm="6">
        <AppCardInformation
          title="Capaian Anda"
          :target-value="capaianPerOrang[0].jumlah_grid"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card variant="flat" class="h-[calc(100vh-124px-60px)]">
          <v-container>
            <v-row no-gutters class="items-center gap-4">
              <slot name="prepend"></slot>
              <AppTextH5 color="primary">LogBook</AppTextH5>
              <v-spacer></v-spacer>
              <AppButton
                variant="outlined"
                label="Add"
                color="info"
                @click="addDialog = true"
              />
            </v-row>
            <v-data-table
              class="h-[calc(100vh-124px-110px)] header-theme"
              :headers="logbookHeader"
              :items="logbook"
              fixed-header
              fixed-footer
            >
              <template #item.capaian_su>
                {{ handleDataTable(item?.capaian_su) }}
              </template>
              <template #item.capaian_mdl>
                {{ handleDataTable(item?.capaian_mdl) }}
              </template>
              <template #item.keterangan>
                {{ handleDataTable(item?.keterangan) }}
              </template>
              <template #item.jam_kerja>
                {{ handleDataTable(item?.jam_kerja) }}
              </template>
              <template #item.jam_lembur>
                {{ handleDataTable(item?.jam_lembur) }}
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
      <!-- <v-col cols="12" sm="3">
        <v-card variant="flat" class="h-[calc(100vh-124px-60px)]"></v-card>
      </v-col> -->
    </v-row>
  </v-container>
  <AppDialog v-model="addDialog">
    <v-card>
      <v-card-text>
        <v-form
          id="logbookForm"
          ref="formRef"
          @submit.prevent="handleSubmitLogbook()"
        >
          <v-row>
            <v-col cols="12">
              <AppInputDatePicker
                v-model="logBookForm.tanggal"
                label="Tanggal"
                :rules="[(value) => !!value || 'This field is required']"
                required
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <AppInputAutocomplete
                v-model="logBookForm.kegiatan"
                :items="['Peta Garis', 'Blok Tanah', 'MDL']"
                label="Nama Kegiatan"
                hide-details
              />
            </v-col>
            <v-col cols="4">
              <AppInputText
                v-model="logBookForm.capaian_pg"
                label="PG (ha)"
                hide-details
                type="number"
              />
            </v-col>
            <v-col cols="4">
              <AppInputText
                v-model="logBookForm.capaian_su"
                label="SU (Blok Tanah)"
                hide-details
                type="number"
              />
            </v-col>
            <v-col cols="4">
              <AppInputText
                v-model="logBookForm.capaian_mdl"
                label="MDL (ha)"
                hide-details
                type="number"
              />
            </v-col>
            <v-col cols="4">
              <AppInputText
                v-model="logBookForm.capaian_pg_url"
                label="Url PG"
                hide-details
              />
            </v-col>
            <v-col cols="4">
              <AppInputText
                v-model="logBookForm.capaian_su_url"
                label="Url SU"
                hide-details
              />
            </v-col>
            <v-col cols="4">
              <AppInputText
                v-model="logBookForm.capaian_mdl_url"
                label="Url MDL"
                hide-details
              />
            </v-col>
            <v-col cols="6">
              <AppInputText
                v-model="logBookForm.jam_kerja"
                label="Jam Kerja"
                hide-details
                type="number"
              />
            </v-col>
            <v-col cols="6">
              <AppInputText
                v-model="logBookForm.jam_lembur"
                label="Jam Lembur"
                hide-details
                type="number"
              />
            </v-col>
            <v-col cols="12">
              <AppInputTextarea
                v-model="logBookForm.keterangan"
                label="Keterangan Lain"
                hide-details
              />
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <AppButton label="Cancel" color="info" variant="outlined" />
            <AppButton
              form="logbookForm"
              label="Submit"
              color="success"
              type="submit"
            />
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </AppDialog>
</template>
<script setup>
import { AppInputAutocomplete } from "#components";
import { collection, doc, setDoc, getDocs, query } from "firebase/firestore";
import employeeConstant from "~/app/constant/employee.constant";
import petaGarisMock from "~/app/mock/petaGaris.mock";
const authStore = useAuthStore();
const capaianPerOrang = petaGarisMock.pembagianArea.filter(
  (item) => item.employee_email == authStore.user.email
);
const appStore = useAppStore();
const db = useFirestore();
const formRef = ref();
const addDialog = ref(false);
const logBookForm = ref({ tanggal: "" });
const handleSubmitLogbook = async () => {
  const employeeRef = collection(db, "employee");
  const employeeDoc = doc(employeeRef, authStore.user.uid);
  const logPresensiRef = collection(employeeDoc, "logbook_harian");
  const { valid } = await formRef.value.validate();
  if (valid) {
    const payload = {
      ...logBookForm.value,
    };
    await setDoc(doc(logPresensiRef, logBookForm.value.tanggal), payload, {
      merge: true,
    }).then(() => {
      logBookForm.value = {};
      addDialog.value = false;
      getAllLogBook();
    });
  }
};
const logbook = ref([]);
const getAllLogBook = async () => {
  try {
    const collectionPath = `/employee/${authStore.user.uid}/logbook_harian`;
    const logbookQuery = query(collection(db, collectionPath));
    const querySnapshot = await getDocs(logbookQuery);
    logbook.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    appStore.toastError("Gagal Mendapatkan Data");
  }
};
getAllLogBook();
const logbookHeader = employeeConstant.logBookHeader;
</script>
<style scoped>
.header-theme:deep() th {
  color: rgb(var(--v-theme-primary));
}
.header-theme:deep() .v-data-table-header__content span {
  font-weight: bold;
}
</style>
