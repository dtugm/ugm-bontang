<template>
  <v-btn color="info" @click="addTaskDialog = true">Add Task</v-btn>
  <AppDialog title="Add Task" v-model="addTaskDialog">
    <v-card-text>
      <AppInputAutocomplete
        v-model="form.pj"
        label="Penanggung Jawab"
        :items="appMock.penanggungJawab"
        item-title="name"
        item-value="id"
      />
      <AppInputAutocomplete
        v-model="form.employee"
        label="Employee"
        :items="appMock.employee"
        item-title="name"
        item-value="id"
      />
      <v-row class="items-end">
        <v-col>
          <AppInputText v-model="form.area" label="Area" hide-details />
        </v-col>
        <v-col>
          <v-combobox
            v-model="form.grid"
            variant="outlined"
            density="compact"
            type="number"
            label="Grid"
            hide-details
            multiple
            chips
          ></v-combobox>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        variant="elevated"
        color="primary"
        @click="addTask(form.pj, form.employee, form.area, form.grid)"
      >
        Submit</v-btn
      >
    </v-card-actions>
  </AppDialog>
</template>
<script lang="ts" setup>
import appMock from "~/app/mock/app.mock";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
const emit = defineEmits(["afterSubmit"]);
const addTaskDialog = ref(false);
const appStore = useAppStore();
const form = ref({
  pj: "",
  employee: "",
  area: 0,
  grid: [],
});
const db = useFirestore();
const addTask = async (
  pj: string,
  employee: string,
  area: number,
  grid: number[]
) => {
  const responsiblesRef = collection(db, "responsibles");
  const responsibleDoc = doc(responsiblesRef, pj);
  const employeesRef = collection(responsibleDoc, "employees");
  const employeeDoc = doc(employeesRef, employee);
  const tasksRef = collection(employeeDoc, "peta_garis_task");
  for (const id of grid) {
    const taskDoc = doc(tasksRef, `A${area}-G${id}`);
    await setDoc(
      taskDoc,
      {
        bagi_18: Number(area),
        GRID: id,
        status: 0,
        file_url: null,
        digitasi_bangunan: 0,
        digitasi_bangunan_notes: null,
        digitasi_transportasi: 0,
        digitasi_transportasi_notes: null,
        digitasi_badan_air: 0,
        digitasi_badan_air_notes: null,
        digitasi_penutupan_lahan: 0,
        digitasi_penutupan_lahan_notes: null,
        digitasi_relief: 0,
        digitasi_relief_notes: null,
        digitasi_batas_administrasi: 0,
        digitasi_batas_administrasi_notes: null,
        digitasi_toponomi: 0,
        digitasi_toponomi_notes: null,
        date_created: new Date(),
        date_submitted: null,
      },
      { merge: true }
    );
  }
  addTaskDialog.value = false;
  emit("afterSubmit");
  appStore.toastSuccess("Sukses Menambahkan Task");
};
</script>
