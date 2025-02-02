<template>
  <v-container class="h-full" fluid>
    <v-card class="h-full" variant="flat">
      <v-container>
        <v-row no-gutters class="items-center gap-4">
          <slot name="prepend"></slot>
          <AppTextH5 color="text"> Progress Peta Garis</AppTextH5>
        </v-row>
        <v-data-table
          class="h-[calc(100vh-80px)] header-theme"
          :loading="isTableLoading"
          :headers="header"
          :items="taskList"
          items-per-page="50"
          fixed-header
          fixed-footer
        >
          <template #item.status="{ item }: any">
            <v-chip :color="statusGridColor[item.status]">
              {{ statusGrid[item.status] }}
            </v-chip>
          </template>
          <template #item.date_created="{ item }: any">
            {{ formatDateFirebase(item.date_created) }}
          </template>
          <template #item.date_submitted="{ item }: any">
            <p v-if="item.date_submitted">
              {{ formatDateFirebase(item.date_submitted) }}
            </p>
            <p v-else>Not submmited yet</p>
          </template>
          <template #item.action="{ item }: any">
            <div class="flex gap-1 justify-end">
              <v-btn
                v-if="item.status == 2"
                class="text-none"
                color="tertiary"
                @click="openDetail(item)"
                >Notes</v-btn
              >
              <v-btn
                class="text-none"
                color="tertiary"
                variant="outlined"
                prepend-icon="mdi-upload"
                @click="openForm(item)"
                >Upload</v-btn
              >
            </div>
          </template>
        </v-data-table>
      </v-container>
    </v-card>
  </v-container>
  <AppDialog v-model="submitDialog">
    <v-card-text>
      <v-form
        id="submitForm"
        ref="formSubmitRef"
        @submit.prevent="handleSubmitTask()"
      >
        <AppInputTextarea
          v-model="googleDriveUrl"
          label="Google Drive URL"
          :rules="[() => !!googleDriveUrl || 'This field is required']"
          hide-details
          required
        />
        <div>
          <v-checkbox v-model="yakin" color="primary" hide-details>
            <template v-slot:label>
              <p class="text-text">
                Saya yakin akan mengirimkan
                <span class="text-primary"> File </span>Ini
              </p>
            </template>
          </v-checkbox>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <AppButton
            label="Cancel"
            color="info"
            variant="outlined"
            @click="submitDialog = false"
          />
          <AppButton
            :disabled="!yakin"
            form="submitForm"
            label="Submit"
            color="success"
            type="submit"
          />
        </v-card-actions>
      </v-form>
    </v-card-text>
  </AppDialog>
  <AppDialog :title="selectedTask?.id" v-model="detailDialog">
    <v-card-text>
      <v-row>
        <v-col cols="6" v-for="(item, index) in petaGarisConstant.digitasiItem">
          <div class="flex gap-1">
            <AppTextH5 class="text-sm" color="primary"> {{ item }} </AppTextH5>
            <v-icon
              :icon="digitasiStatusIcon[selectedTask[index]]"
              :color="digitasiStatusColor[selectedTask[index]]"
            ></v-icon>
          </div>
          <div v-if="selectedTask[index] == 1">
            <p class="text-text">Revisi notes:</p>
            {{ selectedTask[`${index}_notes`] }}
          </div>
          <div v-if="selectedTask[index] == 0">tidak ada</div>
        </v-col>
      </v-row>
    </v-card-text>
  </AppDialog>
</template>
<script lang="ts" setup>
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import petaGarisConstant from "~/app/constant/petaGaris.constant";
import employeeConstant from "~/app/constant/employee.constant";
import appMock from "~/app/mock/app.mock";
const digitasiStatusColor: any = petaGarisConstant.digitasiStatusColor;
const digitasiStatusIcon: any = petaGarisConstant.digitasiStatusIcon;

//Firebase
const db = useFirestore();
const appStore = useAppStore();
const isTableLoading = ref(false);
const selectedTask: any = ref({});
const submitDialog = ref(false);
const detailDialog = ref(false);
const openForm = (item: any) => {
  submitDialog.value = true;
  selectedTask.value = item;
};
const openDetail = (item: any) => {
  detailDialog.value = true;
  selectedTask.value = item;
};
const header: any = employeeConstant.petaGarisHeader;
const statusGrid: any = petaGarisConstant.statusGrid;
const statusGridColor: any = petaGarisConstant.statusGridColor;
const employeeList = appMock.employee;
const authStore = useAuthStore();
const taskList: any = ref([]);
const employee: any = employeeList.find(
  (employee) => employee.email == authStore.user?.email
);
async function fetchFilteredOrders() {
  isTableLoading.value = true;
  const collectionPath = `/responsibles/${employee?.responsibleId}/employees/${employee?.id}/peta_garis_task`;
  try {
    const ordersQuery = query(
      collection(db, collectionPath),
      orderBy("GRID", "asc")
    );
    const querySnapshot = await getDocs(ordersQuery);
    taskList.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    isTableLoading.value = false;
  } catch (error) {
    console.error("Error fetching filtered orders:", error);
    isTableLoading.value = false;
  }
}
fetchFilteredOrders();
const formSubmitRef = ref();
const googleDriveUrl = ref("");
const yakin = ref(false);
const handleSubmitTask = async () => {
  const { valid } = await formSubmitRef.value.validate();
  if (valid) {
    const responsiblesRef = collection(db, "responsibles");
    const responsibleDoc = doc(responsiblesRef, employee?.responsibleId);
    const employeesRef = collection(responsibleDoc, "employees");
    const employeeDoc = doc(employeesRef, employee?.id);
    const tasksRef = collection(employeeDoc, "peta_garis_task");
    const taskDoc = doc(tasksRef, selectedTask.value.id);
    const payload = {
      file_url: googleDriveUrl.value,
      status: 1,
      date_submitted: new Date(),
    };
    await setDoc(taskDoc, payload, { merge: true }).then(() => {
      submitDialog.value = false;
      appStore.toastSuccess("Data berhasil disubmit!");
      googleDriveUrl.value = "";
      yakin.value = false;
      employee?.email;
      appStore.sendUpdateEmail(
        employee.email,
        employee.responsibleEmail,
        "QC Dong Bang!, Naik Gaji lah..",
        `Bang makan bang, Periksa id ini bang ${selectedTask.value.id}`
      );
      fetchFilteredOrders();
    });
  }
};
</script>
<style scoped>
.header-theme:deep() thead {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
}
.header-theme:deep() .v-data-table-header__content span {
  font-weight: bold;
}
</style>
