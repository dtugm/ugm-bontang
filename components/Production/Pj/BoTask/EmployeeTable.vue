<template>
  <v-row no-gutters class="items-center gap-4">
    <AppTextH5 color="primary"> List Kerjaan </AppTextH5>
    <v-spacer></v-spacer>
    <v-col lg="3">
      <AppInputAutocomplete
        v-model="filterTable"
        :items="[
          { title: 'To Do', value: 0 },
          { title: 'To Do Review', value: 1 },
          { title: 'Revision', value: 2 },
          { title: 'Done', value: 3 },
        ]"
      />
    </v-col>
  </v-row>
  <v-data-table
    class="h-[calc(100vh-150px)]"
    :items="filterTaskList"
    :headers="header"
    items-per-page="50"
    v-model:sort-by="sortBy"
    fixed-header
    fixed-footer
  >
    <template #item.status="{ item }: any">
      <v-chip :color="statusGridColor[item.status]">
        {{ statusGrid[item.status] }}
      </v-chip>
    </template>
    <template #item.date_submitted="{ item }: any">
      <p v-if="item.date_submitted">
        {{ item.date_submitted }}
      </p>
      <p v-else>Not submmited yet</p>
    </template>
    <template #item.done_date="{ item }: any">
      <p v-if="item.done_date">
        {{ item.done_date }}
      </p>
      <p v-else>Not submmited yet</p>
    </template>
    <template #item.file="{ item }: any">
      <v-btn
        v-if="item.file_url"
        icon="mdi-folder-download-outline"
        class="text-none"
        size="sm"
        variant="flat"
        @click="downloadFile(item.file_url)"
      ></v-btn>
      <p v-else>Not submmited yet</p>
    </template>
    <template #item.action="{ item }: any">
      <v-btn
        class="text-none"
        color="primary"
        variant="outlined"
        @click="processTask(item)"
        >Evaluate</v-btn
      >
    </template>
  </v-data-table>
  <AppDialog v-model="rejectDialog" width="900">
    <v-card-text>
      <v-form>
        <v-row>
          <v-col cols="12" sm="12">
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
              hide-details
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
  query,
  setDoc,
  where,
} from "firebase/firestore";
import petaGarisConstant from "~/app/constant/petaGaris.constant";
import pjConstant from "~/app/constant/pj.constant";
const sortBy: any = ref([{ key: "new_grid", order: "asc" }]);
const props = defineProps({
  employee: {
    type: Object,
    default: () => {},
  },
});
const filterTable = ref(0);
const db = useFirestore();
const taskList: any = ref([]);
const filterTaskList = computed(() => {
  return taskList.value.filter((item: any) => {
    return item.status == filterTable.value;
  });
});
const isTableLoading = ref(false);
const header: any = pjConstant.evaluasiBoHeader;
const statusGrid: any = petaGarisConstant.statusGrid;
const statusGridColor: any = petaGarisConstant.statusGridColor;
const digitasiStatusColor: any = petaGarisConstant.digitasiStatusColor;
async function fetchFilteredOrders() {
  isTableLoading.value = true;
  const collectionPath = `/employee/${props.employee?.uid}/bo_task`;
  try {
    const ordersQuery = query(
      collection(db, collectionPath)
      // where("status", "!=", 0)
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
  const responsiblesRef = collection(db, "employee");
  const responsibleDoc = doc(responsiblesRef, props.employee?.uid);
  const tasksRef = collection(responsibleDoc, "bo_task");
  const taskDoc = doc(tasksRef, selectedtask.value.id);

  const payload = {
    ...selectedtask.value,
    status: status,
    ...(status === 3 && { done_date: tanggalIndoNowLengkap() }),
  };
  await setDoc(taskDoc, payload, { merge: true }).then(() => {
    rejectDialog.value = false;
    yakin.value = false;
    appStore.sendUpdateEmail;
    if (status == 2) {
      appStore.sendUpdateEmail(
        props.employee?.responsibleEmail,
        props.employee?.email,
        "REVISI DIGITASI",
        `Revisi pada grid: ${selectedtask.value.new_grid} Area: ${selectedtask.value.area}. Buka Aplikasi untuk mencari lebih tahu mengenai Detailnya`
      );
    }
    appStore.toastSuccess("Data berhasil disubmit!");
    fetchFilteredOrders();
  });
};
</script>
