<template>
  <AppTableBasic
    title="Groups Table"
    :items="groupStore.groupsItems"
    :headers="groupConstant.groupTable"
  >
    <template #action>
      <v-btn
        variant="outlined"
        color="success"
        class="text-none"
        prepend-icon="mdi-plus"
        @click="addDialog = true"
        >Add
      </v-btn>
    </template>
    <template #item.member="{ item }">{{ item.members.length }}</template>
    <template #item.action="{ item }">
      <div class="flex">
        <v-btn
          @click="deleteItem(item)"
          icon
          variant="flat"
          rounded="sm"
          density="compact"
        >
          <v-icon color="tertiary">mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          @click="deleteItem(item)"
          icon
          variant="flat"
          rounded="sm"
          density="compact"
        >
          <v-icon color="primary">mdi-delete</v-icon>
        </v-btn>
      </div>
    </template>
  </AppTableBasic>
  <AppDialogConfirm
    v-model="deleteDialog"
    @confirm="confirmDeleteItem()"
    @close="deleteDialog = false"
  >
    Hapus Data Group
  </AppDialogConfirm>
  <AppDialogConfirm
    title="Add New Group"
    close-text="Cancel"
    confirm-text="Add"
    confirm-color="tertiary"
    v-model="addDialog"
    @confirm="confirmAddItem()"
    @close="addDialog = false"
  >
    <AppInputText label="Group Name" v-model="addGroupForm.name" />
    <AppInputText label="Description" v-model="addGroupForm.description" />
  </AppDialogConfirm>
</template>
<script lang="ts" setup>
import groupConstant from "~/app/constant/group.constant";
const selectedId = ref();
const groupStore = useGroup();
groupStore.getAllGroups();
const deleteDialog = ref(false);
const addDialog = ref(false);
const deleteItem = (item: any) => {
  selectedId.value = item.id;
  deleteDialog.value = true;
};
const confirmDeleteItem = async () => {
  await groupStore.deleteDataGroups(selectedId.value);
  deleteDialog.value = false;
  groupStore.getAllGroups();
};

const addGroupForm = ref<IUploadGroupsParams>({
  name: null,
  description: null,
});
const confirmAddItem = async () => {
  await groupStore.addNewGroup(addGroupForm.value);
  addDialog.value = false;
  groupStore.getAllGroups();
};
</script>
