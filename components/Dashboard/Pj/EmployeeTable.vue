<template>
  <v-data-table :items="taskList" :headers="header">
    <template #item.status="{ item }: any">
      <v-chip :color="statusGridColor[item.status]">
        {{ statusGrid[item.status] }}
      </v-chip>
    </template>
    <template #item.date_submitted="{ item }: any">
      <p v-if="item.date_submitted">
        {{ formatDateFirebase(item.date_submitted) }}
      </p>
      <p v-else>Not submmited yet</p>
    </template>
    <template #item.file="{ item }: any">
      <v-btn
        icon="mdi-folder-download-outline"
        class="text-none"
        size="sm"
        variant="flat"
        @click="downloadFile(item.file_url)"
      ></v-btn>
    </template>
    <template #item.action="{ item }: any">
      <v-btn
        class="text-none"
        color="primary"
        variant="outlined"
        @click="processTask(item)"
        >Porcess</v-btn
      >
    </template>
  </v-data-table>
  <AppDialog v-model="rejectDialog" width="900">
    <v-card-text>
      <v-form>
        <v-row>
          <v-col cols="12" sm="3">
            <AppInputSelect
              class-label="text-primary font-semibold"
              label="Digitasi Badan Air"
              ref="formSubmitRef"
              v-model="selectedtask.digitasi_badan_air"
              :items="digitasiStatusList"
              hide-details
              chips
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :text="item.title"
                  :color="digitasiStatusColor[item.value]"
                ></v-chip>
              </template>
            </AppInputSelect>
            <AppInputTextarea
              label="Error Notes"
              v-model="selectedtask.digitasi_badan_air_notes"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <AppInputSelect
              class-label="text-primary font-semibold"
              label="Digitasi Bangunan"
              v-model="selectedtask.digitasi_bangunan"
              :items="digitasiStatusList"
              chips
              hide-details
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :text="item.title"
                  :color="digitasiStatusColor[item.value]"
                ></v-chip>
              </template>
            </AppInputSelect>
            <AppInputTextarea
              label="Error Notes"
              v-model="selectedtask.digitasi_bangunan_notes"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <AppInputSelect
              class-label="text-primary font-semibold"
              label="Digitasi Batas Administrasi"
              v-model="selectedtask.digitasi_batas_administrasi"
              :items="digitasiStatusList"
              chips
              hide-details
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :text="item.title"
                  :color="digitasiStatusColor[item.value]"
                ></v-chip>
              </template>
            </AppInputSelect>
            <AppInputTextarea
              label="Error Notes"
              v-model="selectedtask.digitasi_batas_administrasi_notes"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <AppInputSelect
              class-label="text-primary font-semibold"
              label="Digitasi Penutupan Lahan"
              v-model="selectedtask.digitasi_penutupan_lahan"
              :items="digitasiStatusList"
              chips
              hide-details
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :text="item.title"
                  :color="digitasiStatusColor[item.value]"
                ></v-chip>
              </template>
            </AppInputSelect>
            <AppInputTextarea
              label="Error Notes"
              v-model="selectedtask.digitasi_penutupan_lahan_notes"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <AppInputSelect
              class-label="text-primary font-semibold"
              label="Digitasi Relief"
              v-model="selectedtask.digitasi_relief"
              :items="digitasiStatusList"
              chips
              hide-details
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :text="item.title"
                  :color="digitasiStatusColor[item.value]"
                ></v-chip>
              </template>
            </AppInputSelect>
            <AppInputTextarea
              label="Error Notes"
              v-model="selectedtask.digitasi_relief_notes"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <AppInputSelect
              class-label="text-primary font-semibold"
              label="Digitasi Toponimi"
              v-model="selectedtask.digitasi_toponomi"
              :items="digitasiStatusList"
              hide-details
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :text="item.title"
                  :color="digitasiStatusColor[item.value]"
                ></v-chip>
              </template>
            </AppInputSelect>
            <AppInputTextarea
              label="Error Notes"
              v-model="selectedtask.digitasi_toponomi_notes"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <AppInputSelect
              class-label="text-primary font-semibold"
              label="Digitasi Transportasi"
              v-model="selectedtask.digitasi_transportasi"
              :items="digitasiStatusList"
              chips
              hide-details
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :text="item.title"
                  :color="digitasiStatusColor[item.value]"
                ></v-chip>
              </template>
            </AppInputSelect>
            <AppInputTextarea
              label="Error Notes"
              v-model="selectedtask.digitasi_notes"
            />
          </v-col>
        </v-row>
      </v-form>
      <v-checkbox v-model="yakin" color="primary" hide-details>
        <template v-slot:label>
          <p class="text-text">
            Saya yakin telah
            <span class="text-primary"> Memeriksa </span> tugas ini
          </p>
        </template>
      </v-checkbox>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        :disabled="!yakin"
        class="text-none"
        color="error"
        variant="outlined"
        @click="submitTask(2)"
        >Reject</v-btn
      >
      <!-- 2 untuk Reject -->
      <v-btn
        :disabled="!yakin"
        class="text-none"
        color="success"
        variant="elevated"
        @click="submitTask(3)"
        >Approve</v-btn
      >
      <!-- 3 untuk Approve -->
    </v-card-actions>
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
  where,
} from "firebase/firestore";
import petaGarisConstant from "~/app/constant/petaGaris.constant";
import pjConstant from "~/app/constant/pj.constant";
const props = defineProps({
  employee: {
    type: Object,
    default: () => {},
  },
});
const db = useFirestore();
const taskList: any = ref([]);
const isTableLoading = ref(false);
const header: any = pjConstant.evaluasiHeader;
const statusGrid: any = petaGarisConstant.statusGrid;
const statusGridColor: any = petaGarisConstant.statusGridColor;
const digitasiStatusColor: any = petaGarisConstant.digitasiStatusColor;
async function fetchFilteredOrders() {
  isTableLoading.value = true;
  const collectionPath = `/responsibles/${props.employee?.responsibleId}/employees/${props.employee?.id}/peta_garis_task`;
  try {
    const ordersQuery = query(
      collection(db, collectionPath),
      where("status", "!=", 0)
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
function getUniqueCodeFromURL(url: string) {
  const regex = /\/file\/d\/([^/]+)\//;
  const match = url.match(regex);
  return match ? match[1] : null;
}
const downloadFile = async (url: string) => {
  const Gid = getUniqueCodeFromURL(url);
  window.open(
    `https://drive.google.com/uc?export=download&id=${Gid}`,
    "_blank"
  );
};
const selectedtask: any = ref<IPetaGarisTaskItem | undefined>(undefined);
const digitasiStatusList = petaGarisConstant.digitasiStatusList;
// Dialog Reject
const rejectDialog = ref(false);

const processTask = (task: any) => {
  selectedtask.value = task;
  rejectDialog.value = true;
};
const yakin = ref(false);
const appStore = useAppStore();
const submitTask = async (status: number) => {
  const responsiblesRef = collection(db, "responsibles");
  const responsibleDoc = doc(responsiblesRef, props.employee?.responsibleId);
  const employeesRef = collection(responsibleDoc, "employees");
  const employeeDoc = doc(employeesRef, props.employee?.id);
  const tasksRef = collection(employeeDoc, "peta_garis_task");
  const taskDoc = doc(tasksRef, selectedtask.value.id);
  const payload = {
    ...selectedtask.value,
    status: status,
  };
  await setDoc(taskDoc, payload, { merge: true }).then(() => {
    rejectDialog.value = false;
    appStore.toastSuccess("Data berhasil disubmit!");
    fetchFilteredOrders();
  });
};
</script>
