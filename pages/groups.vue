<template>
  <AppDialog
    :title="`${stringHelper.titleCase(selectedGroup)} Members`"
    v-model="memberDialog"
  >
    <v-row class="mx-2">
      <v-col>
        <AppInputAutocomplete
          placeholder="Enter Email"
          v-model="addMemberForm.userId"
          :items="userStore.usersList"
          hide-details
          item-title="email"
          item-value="id"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="tertiary"
          @click="addMember"
          class="text-none"
          :loading="addMemberLoading"
          >Add Member</v-btn
        >
      </v-col>
    </v-row>
    <AppTableBasic
      :title="`User ${stringHelper.titleCase(selectedGroup)}`"
      :items="selectedMember"
    >
      <template #action> </template>
    </AppTableBasic>
  </AppDialog>
  <AppTableBasic
    title="Groups Table"
    :loading="isLoading"
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
    <template #item.member="{ item }">
      {{ item.members.length }}
      <v-btn icon size="30" variant="flat" @click="openMember(item)">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>
    <template #item.action="{ item }">
      <div class="flex">
        <!-- <v-btn
          @click="deleteItem(item)"
          icon
          variant="flat"
          rounded="sm"
          density="compact"
        >
          <v-icon color="tertiary">mdi-pencil</v-icon>
        </v-btn> -->
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
    :confirm-loading="groupStore.actBtnLoading"
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
    :confirm-loading="groupStore.actBtnLoading"
    @confirm="confirmAddGroup()"
    @close="addDialog = false"
  >
    <AppInputText label="Group Name" v-model="addGroupForm.name" />
    <AppInputText label="Description" v-model="addGroupForm.description" />
  </AppDialogConfirm>
</template>
<script lang="ts" setup>
import groupConstant from "~/app/constant/group.constant";
import stringHelper from "~/app/helper/string.helper";
const userStore = useUsersStore();
const isLoading = ref(false);
const addMemberLoading = ref(false);
function formatTeamMembers(data: any[]) {
  return data.map((item) => ({
    role: item.role,
    name: `${item.user.firstName} ${item.user.lastName}`,
    email: item.user.email,
    id: item.user.id,
  }));
}
const selectedMember: any = ref([]);
const memberDialog = ref(false);
const selectedGroup = ref("");
const groupId = ref("");
const openMember = (item: any) => {
  memberDialog.value = true;
  selectedGroup.value = item.name;
  groupId.value = item.id;
  selectedMember.value = formatTeamMembers(item.members);
};
const selectedId = ref();
const groupStore = useGroup();
const deleteDialog = ref(false);
const addDialog = ref(false);
const deleteItem = (item: any) => {
  selectedId.value = item.id;
  deleteDialog.value = true;
};
const confirmDeleteItem = async () => {
  await groupStore.deleteDataGroups(selectedId.value);
  deleteDialog.value = false;
  getAllGroups();
};
const addGroupForm = ref<IUploadGroupsParams>({
  name: null,
  description: null,
});
const confirmAddGroup = async () => {
  await groupStore.addNewGroup(addGroupForm.value);
  addDialog.value = false;
  getAllGroups();
};
const addMemberForm = ref({
  userId: null,
  role: "MEMBER",
});
const addMember = async () => {
  addMemberLoading.value = true;
  await groupStore.addMemberToGroup(groupId.value, addMemberForm.value);
  addMemberLoading.value = false;
  memberDialog.value = false;
  getAllGroups();
};
const getAllGroups = async () => {
  isLoading.value = true;
  await groupStore.getAllGroups();
  isLoading.value = false;
};
onMounted(() => {
  userStore.getUsersList();
  getAllGroups();
});
</script>
