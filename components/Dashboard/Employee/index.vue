<template>
  <v-container>
    <v-row align="stretch" class="">
      <v-col cols="12" sm="4">
        <DashboardEmployeePresensi />
      </v-col>
      <v-col cols="12" sm="4" align-self="end">
        <AppCardProgress
          title="Capaian"
          unit="GRID"
          :total-value="capaianTarget?.jumlah_grid"
          :progress="pencapaianEmployee"
        />
      </v-col>
      <v-col cols="12" sm="4" align-self="end">
        <AppCardProgress />
      </v-col>
    </v-row>
    <v-row class="">
      <v-col cols="12" sm="12" class="h-full">
        <v-card class="h-full" variant="flat">
          <v-data-table :headers="header" :items="taskList">
            <template #item.status="{ item }: any">
              <v-chip :color="statusGridColor[item.status]">
                {{ statusGrid[item.status] }}
              </v-chip>
            </template>
            <template #item.date_created="{ item }: any">
              {{ formatDateFirebase(item.date_created) }}
            </template>
            <template #item.action="{ item }: any">
              <div class="flex gap-1 justify-end">
                <v-btn
                  v-if="item.status == 2"
                  class="text-none"
                  color="primary"
                  @click="openDetail(item)"
                  >Notes</v-btn
                >
                <v-btn
                  class="text-none"
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-upload"
                  @click="openForm(item)"
                  >Upload</v-btn
                >
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <AppDialog v-model="submitDialog">
    <v-card-text>
      <AppInputText label="Google Drive URL" />
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
            <p class="text-text">notes:</p>
            {{ selectedTask[`${index}_notes`] }}
          </div>
          <div v-if="selectedTask[index] == 0">tidak tersedia</div>
        </v-col>
      </v-row>
    </v-card-text>
  </AppDialog>
</template>
<script lang="ts" setup>
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import petaGarisMock from "~/app/mock/petaGaris.mock";
import petaGarisConstant from "~/app/constant/petaGaris.constant";
import employeeConstant from "~/app/constant/employee.constant";
const digitasiStatus: any = petaGarisConstant.digitasiStatus;
const digitasiStatusColor: any = petaGarisConstant.digitasiStatusColor;
const digitasiStatusIcon: any = petaGarisConstant.digitasiStatusIcon;
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
import appMock from "~/app/mock/app.mock";
const employeeList = appMock.employee;
const taskHeader: any = petaGarisConstant.progressHeader;
const db = useFirestore();
const authStore = useAuthStore();
const capaianTarget = petaGarisMock.pembagianArea.find((item) => {
  return item.employee_email == authStore.user?.email;
});
const taskList: any = ref([]);
async function fetchFilteredOrders() {
  const employee = employeeList.find(
    (employee) => employee.email == authStore.user?.email
  );
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
  } catch (error) {
    console.error("Error fetching filtered orders:", error);
  }
}
const pencapaianEmployee = computed(() => {
  return taskList.value.filter((item: any) => item.status === 3).length;
});
fetchFilteredOrders();
</script>
