<template>
  <v-container>
    <v-row no-gutters class="items-center gap-4">
      <AppTextH5 class="text-lg" color="text"
        >Kerjaan Building Outline</AppTextH5
      >
      <v-spacer></v-spacer>
      <v-btn
        variant="elevated"
        class="text-none"
        color="info"
        @click="sendEmail"
        >Kasi Tau Mereka!</v-btn
      >
      <v-btn
        variant="elevated"
        class="text-none"
        color="primary"
        @click="addTask"
        >Add New Task</v-btn
      >
    </v-row>
    <v-data-table :items="taskList" :headers="boTaskHeder">
      <template #item.status="{ item }: any">
        <v-chip :color="statusGridColor[item.status]">
          {{ statusGrid[item.status] }}
        </v-chip>
      </template>
      <template #item.file_kerja="{ item }: any">
        <v-btn
          icon="mdi-folder-google-drive"
          class="text-none"
          size="sm"
          variant="flat"
          @click="openDrive(item.file_kerja)"
        ></v-btn>
      </template>
    </v-data-table>
  </v-container>
  <AppDialog title="Add Task" v-model="addTaskDialog">
    <v-form id="TaskForm" ref="formRef" @submit.prevent="submitTask()">
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="formNewTask.area"
              label="Area"
              variant="outlined"
              density="compact"
              type="number"
              :is-filter="false"
              hide-details
              :rules="[(value) => !!value || 'This field is required']"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="formNewTask.old_grid"
              label="Grid Lama"
              variant="outlined"
              density="compact"
              type="number"
              :is-filter="false"
              hide-details
              :rules="[(value) => !!value || 'This field is required']"
            />
          </v-col>
          <v-col cols="4">
            <AppInputAutocomplete
              v-model="formNewTask.pj"
              label="Penanggung Jawab"
              :items="appMock.penanggungJawab"
              :is-filter="true"
              item-title="name"
              item-value="id"
              hide-details
              :rules="[(value:any) => !!value || 'This field is required']"
            />
          </v-col>
          <v-col cols="12">
            <v-combobox
              v-model="formNewTask.new_grid"
              variant="outlined"
              density="compact"
              type="number"
              label="Grid Baru"
              hide-details
              multiple
              chips
              :rules="[(value) => !!value || 'This field is required']"
            ></v-combobox>
          </v-col>
          <v-col cols="12">
            <AppInputTextarea
              v-model="formNewTask.file_kerja"
              label="Link File Kerja"
              :is-filter="false"
              hide-details
              :rules="[(value:any) => !!value || 'This field is required']"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <AppButton
          form="TaskForm"
          color="success"
          type="submit"
          label="Submit"
        />
      </v-card-actions>
    </v-form>
  </AppDialog>
</template>
<script setup lang="ts">
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import petaGarisConstant from "~/app/constant/petaGaris.constant";
import pjConstant from "~/app/constant/pj.constant";
import appMock from "~/app/mock/app.mock";
const appStore = useAppStore();
const statusGrid: any = petaGarisConstant.statusGrid;
const statusGridColor: any = petaGarisConstant.statusGridColor;
const props = defineProps<{
  selectedEmployee?: any;
}>();
const formRef = ref();
const boTaskHeder: any = pjConstant.employeeBoTaskHeader;
const formNewTask: any = ref({});
const addTaskDialog = ref(false);
const addTask = () => {
  addTaskDialog.value = true;
};
const openDrive = (url: any) => {
  window.open(url, "_blank");
};
const taskList: any = ref([]);
const db = useFirestore();
const employeeRef = collection(db, "employee");
const employeeDoc = doc(employeeRef, props.selectedEmployee.uid);
const boTaskRef = collection(employeeDoc, "bo_task");
const submitTask = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    try {
      const promises: any = [];
      await formNewTask.value.new_grid.forEach((item: any) => {
        const payload = {
          id: `A${formNewTask.value.area}OG${formNewTask.value.old_grid}NG${item}`,
          area: formNewTask.value.area,
          old_grid: formNewTask.value.old_grid,
          new_grid: item,
          date_created: tanggalIndoNowLengkap(),
          digitasi_bangunan: 0,
          digitasi_bangunan_notes: null,
          date_submitted: null,
          file_kerja: formNewTask.value.file_kerja,
          file_url: null,
          status: 0,
        };
        const promise = setDoc(
          doc(
            boTaskRef,
            `A${formNewTask.value.area}OG${formNewTask.value.old_grid}NG${item}`
          ),
          payload,
          {
            merge: true,
          }
        );
        promises.push(promise);
      });
      await Promise.all(promises);
      appStore.toastSuccess("Berhasil Menambahkan Task");

      getAllDocuments();
      addTaskDialog.value = false;
      formNewTask.value = {};
    } catch (error) {
      appStore.toastSuccess("Error :(");
    }
  }
};

const getAllDocuments = async () => {
  const collectionPath = `/employee/${props.selectedEmployee.uid}/bo_task`;
  const ordersQuery = query(collection(db, collectionPath));
  const querySnapshot = await getDocs(ordersQuery);
  taskList.value = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
  }));
};
getAllDocuments();

const sendEmail = async () => {
  await appStore
    .sendUpdateEmail(
      props.selectedEmployee.responsibleEmail,
      props.selectedEmployee.email,
      "CIHUY TASK BARU!!!",
      `Cek Web nya yak ada task baru, kamu orang terpilih untuk task ini`
    )
    .then(() => {
      appStore.toastSuccess("Pesan Tersampaikan");
    });
};
</script>
