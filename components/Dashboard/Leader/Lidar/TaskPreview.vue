<template>
  <v-container>
    <v-row no-gutters class="items-center gap-4">
      <slot name="prepend"></slot>
      <AppTextH5 color="primary">Studio Lidar</AppTextH5>
      <v-spacer></v-spacer>
      <v-col lg="3">
        <AppInputAutocomplete
          v-model="taskFilter"
          :items="[
            { title: 'To Do', value: 'TODO' },
            { title: 'To Do Review', value: 'TODO_REVIEW' },
            { title: 'Revision', value: 'REVISION' },
            { title: 'Done', value: 'DONE' },
          ]"
          placeholder="Filter By Status"
          @update:model-value="getTaskList()"
          hide-details
        />
      </v-col>

      <AppButton label="Add Task" color="tertiary" @click="openAddTask" />
    </v-row>
    <!-- <AppButton label="Add Task" color="tertiary" @click="openAddTask" /> -->
    <v-data-table :headers="taskHeader" :items="lidarTaskByMember">
      <template #item.notes="{ item }: any">
        <template v-if="item.notes && item.status == 'REVISION'">
          <AppButton label="Note Detail" variant="text" />
        </template>
        <template v-else> Nothing to see </template>
      </template>
      <template #item.action="{ item }: any">
        <div class="flex gap-1">
          <AppButton
            label="Delete"
            variant="outlined"
            @click="deleteTask(item.id)"
          />
          <AppButton label="Edit" color="tertiary" @click="editTask(item)" />
        </div>
      </template>
    </v-data-table>
  </v-container>
  <AppDialog v-model="deleteDialog" title="Delete" width="400">
    <v-card>
      <v-card-text> Yakin, ingin menghapus Task? </v-card-text>
      <v-card-actions>
        <v-btn
          variant="outlined"
          class="flex-grow-1 text-none"
          color="secondary"
          @click="deleteDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          class="flex-grow-1 text-none"
          color="error"
          variant="flat"
          @click="confirmDeleteTask"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </AppDialog>
  <AppDialog v-model="editDialog" title="Edit">
    <v-card>
      <v-card-text>
        <AppInputText v-model="editForm.taskName" label="Grid"></AppInputText>
        <AppInputAutocomplete
          v-model="editForm.status"
          label="Status"
          :items="[
            { title: 'To Do', value: 'TODO' },
            { title: 'To Do Review', value: 'TODO_REVIEW' },
            { title: 'Revision', value: 'REVISION' },
            { title: 'Done', value: 'DONE' },
          ]"
          hide-details
        />
        <AppInputTextarea v-model="editForm.notes" label="Notes" />
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="outlined"
          class="flex-grow-1 text-none"
          color="secondary"
          @click="editDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          class="flex-grow-1 text-none"
          color="tertiary"
          variant="flat"
          @click="confirmEditTask"
        >
          Edit
        </v-btn>
      </v-card-actions>
    </v-card>
  </AppDialog>
  <AppDialog v-model="addTaskDialog" title="Create Task">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <AppTextH5>Create Task Lidar</AppTextH5>
            <AppInputAutocomplete
              v-model="formTask.userId"
              :items="memberLidarItem"
              item-title="email"
              item-value="id"
              label="Member"
            ></AppInputAutocomplete>
            <AppInputText
              v-model="formTask.grid"
              label="Grid"
              type="number"
            ></AppInputText>
            <AppButton
              label="Create Task"
              color="tertiary"
              @click="createMockTask"
            />
          </v-col>
          <v-col cols="6">
            <AppTextH5>Create Bulk Task Lidar</AppTextH5>
            <AppInputAutocomplete
              v-model="formBulkTask.userId"
              :items="memberLidarItem"
              item-title="email"
              item-value="id"
              label="Member"
            ></AppInputAutocomplete>
            <AppInputComboBox v-model="formBulkTask.grid" label="Grid" />
            <AppButton
              label="Create Bulk Task"
              color="tertiary"
              @click="createBulkTask"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </AppDialog>
</template>
<script lang="ts" setup>
import studioLidarApi from "~/app/api/studioLidar.api";
import groupConstant from "~/app/constant/group.constant";

const props = defineProps({
  member: {
    type: Object,
    default: () => {},
  },
});
const lidarTaskByMember = ref([]);
const taskFilter = ref("TODO");
const getTaskList = async () => {
  await studioLidarApi
    .get_all_lidar_tasks(groupConstant.groupId.lidar, {
      assignedToUserId: props.member.id,
      status: taskFilter.value,
    })
    .then((resp) => {
      lidarTaskByMember.value = resp;
    });
};
getTaskList();
const deleteDialog = ref(false);
const deleteId = ref();
const deleteTask = (id: string) => {
  deleteDialog.value = true;
  console.log(id);
  deleteId.value = id;
};
const confirmDeleteTask = async () => {
  console.log(deleteId.value);
  await studioLidarApi.delete_lidar_task(deleteId.value);
  getTaskList();
  deleteDialog.value = false;
};

const editDialog = ref(false);
const editForm = ref();
const editTask = (item: any) => {
  editDialog.value = true;
  console.log(item);
  editForm.value = JSON.parse(JSON.stringify(item));
};
const confirmEditTask = async () => {
  const {
    assignedTo: { id },
    createdAt,
    updatedAt,
    ...payload
  } = editForm.value;
  console.log(id);
  await studioLidarApi.edit_lidar_task(editForm.value.id, {
    assignedToUserId: id,
    groupId: groupConstant.groupId.lidar,
    ...payload,
  });
  getTaskList();
  editDialog.value = false;
};
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
    title: "Server Path",
    key: "serverPath",
  },
  // {
  //   title: "Created At",
  //   key: "createdAt",
  // },
  // {
  //   title: "Upodated At",
  //   key: "updatedAt",
  // },
  {
    title: "Notes",
    key: "notes",
  },
  {
    title: "Actions",
    key: "action",
  },
];
const addTaskDialog = ref(false);
const openAddTask = () => {
  addTaskDialog.value = true;
};
const formTask: any = ref({});
const formBulkTask: any = ref({});
const createMockTask = async () => {
  const payload = {
    groupId: "7d8533c5-5d84-45e8-8812-77aa6cead296",
    assignedToUserId: formTask.value.userId,
    status: "TODO",
    taskName: `GRID ${formTask.value.grid} `,
    notes: "",
    serverPath: "",
  };
  await studioLidarApi.create_lidar_task(payload);
};
const groupStore = useGroup();
const memberLidarItem = computed(() =>
  groupStore.lidarGroup?.members
    .filter((item: any) => item.role == "MEMBER")
    .map((item: any) => ({
      id: item.id,
      ...item.user,
    }))
);
const createBulkTask = async () => {
  const grids = formBulkTask.value.grid;

  if (!Array.isArray(grids)) {
    return;
  }

  const tasks = grids.map((grid) => {
    const payload = {
      groupId: "7d8533c5-5d84-45e8-8812-77aa6cead296",
      assignedToUserId: formBulkTask.value.userId,
      status: "TODO",
      taskName: `GRID ${grid}`,
      notes: "",
      serverPath: "",
    };
    return studioLidarApi.create_lidar_task(payload);
  });

  await Promise.all(tasks);
  getTaskList();
};
</script>
