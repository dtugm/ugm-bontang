<template>
  <v-container class="min-h-screen">
    <v-container class="h-[calc(100vh-32px)] bg-white" fluid>
      <v-container>
        <v-row no-gutters class="items-center gap-4">
          <slot name="prepend"></slot>
          <AppTextH5 color="primary">Studio Lidar</AppTextH5>
          <v-spacer></v-spacer>
          <v-col lg="3">
            <AppInputAutocomplete
              v-model="taskFilter"
              :items="statusOptions"
              placeholder="Filter By Status"
              @update:model-value="getTaskList()"
              hide-details
              clearable
            />
          </v-col>
        </v-row>
        <!-- <AppButton label="Add Task" color="tertiary" @click="openAddTask" /> -->
        <v-data-table :headers="taskHeader" :items="lidarTaskByMember">
          <template #item.notes="{ item }: any">
            <template v-if="item.notes && item.status == 'REVISION'">
              <AppButton
                label="Note Detail"
                variant="text"
                @click="seeNotes(item.notes)"
              />
            </template>
            <template v-else> Nothing to see </template>
          </template>
          <template #item.action="{ item }: any">
            <div class="flex gap-1">
              <AppButton
                label="Edit"
                color="tertiary"
                prepend-icon="mdi-file-edit"
                @click="submitTask(item)"
              />
            </div>
          </template>
        </v-data-table>
      </v-container>
    </v-container>
  </v-container>
  <AppDialog v-model="submitDialog" title="Submit Task">
    <v-card>
      <v-card-text>
        <AppInputAutocomplete
          v-model="submitForm.status"
          label="Status"
          :items="statusOptionsMember"
        />
        <AppInputText
          v-model="submitForm.serverPath"
          placeholder="Z:/"
          label="Path Server"
        />
      </v-card-text>
      <v-card-actions>
        <AppButton
          label="Cancel"
          variant="outlined"
          class="flex-grow-1 text-none"
          color="secondary"
          @click="submitDialog = false"
        />
        <AppButton
          label="Submit"
          class="flex-grow-1 text-none"
          color="tertiary"
          variant="flat"
          @click="confirmSubmitTask"
        />
      </v-card-actions>
    </v-card>
  </AppDialog>
  <AppDialog title="Notes" v-model="notesDialog">
    <v-card>
      <v-card-text>
        {{ selectedNotes }}
      </v-card-text>
    </v-card>
  </AppDialog>
</template>
<script lang="ts" setup>
import studioLidarApi from "~/app/api/studioLidar.api";
import groupConstant from "~/app/constant/group.constant";
const authStore = useAuthenticationStore();
const lidarTaskByMember = ref([]);
const taskFilter = ref(null);
const getTaskList = async () => {
  await studioLidarApi
    .get_all_lidar_tasks(groupConstant.groupId.lidar, {
      assignedToUserId: authStore.user.id,
      status: taskFilter.value ?? null,
    })
    .then((resp) => {
      lidarTaskByMember.value = resp;
    });
};
getTaskList();
const submitDialog = ref(false);
const submitForm = ref();
const submitTask = (item: any) => {
  submitDialog.value = true;
  submitForm.value = JSON.parse(JSON.stringify(item));
};
const confirmSubmitTask = async () => {
  console.log(submitForm.value);
  await studioLidarApi.edit_lidar_task(submitForm.value.id, {
    assignedToUserId: authStore.user.id,
    groupId: groupConstant.groupId.lidar,
    ...submitForm.value,
  });
  submitDialog.value = false;
  getTaskList();
};
const notesDialog = ref(false);
const selectedNotes = ref();
const seeNotes = (item: string) => {
  notesDialog.value = true;
  selectedNotes.value = item;
};
const statusOptions = [
  { title: "To Do", value: "TODO" },
  { title: "To Do Review", value: "TODO_REVIEW" },
  { title: "Revision", value: "REVISION" },
  { title: "Done", value: "DONE" },
];
const statusOptionsMember = [
  { title: "To Do", value: "TODO" },
  { title: "To Do Review", value: "TODO_REVIEW" },
  { title: "Done", value: "DONE" },
];

const taskHeader = [
  {
    title: "GRID",
    key: "taskName",
  },
  {
    title: "status",
    key: "status",
  },
  {
    title: "Created At",
    key: "createdAt",
  },
  {
    title: "Upodated At",
    key: "updatedAt",
  },
  {
    title: "Notes",
    key: "notes",
  },
  {
    title: "Actions",
    key: "action",
  },
];
</script>
