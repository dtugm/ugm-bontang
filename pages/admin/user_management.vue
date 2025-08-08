<template>
  <AppTableBasic
    :loading="isLoading"
    :items="userStore.usersList"
    :headers="usersConstant.userListHeader"
    title="List User"
  >
    <template #action>
      <v-btn
        class="text-none"
        variant="outlined"
        color="tertiary"
        @click="addToOrgDialog = true"
        >Add User To Org</v-btn
      >
    </template>
  </AppTableBasic>
  <AppDialogConfirm
    v-model="addToOrgDialog"
    title="Add User To Organization"
    close-text="Cancel"
    confirm-text="Add"
    confirm-color="tertiary"
    :confirm-loading="isConfirmLoading"
    @close="addToOrgDialog = false"
    @confirm="addUserToOrg"
  >
    <AppInputText label="Email to Add" v-model="addToOrgForm.email" />
    <AppInputAutocomplete
      label="Role"
      v-model="addToOrgForm.role"
      :items="['Admin', 'Member']"
    />
  </AppDialogConfirm>
</template>

<script setup lang="ts">
import usersConstant from "~/app/constant/users.constant";
const userStore = useUsersStore();
const isLoading = ref(false);
const isConfirmLoading = ref(false);
const addToOrgDialog = ref(false);
const addToOrgForm = ref({
  email: null,
  role: null,
});
const resetForm = () => {
  addToOrgForm.value = { email: null, role: null };
};
const addUserToOrg = async () => {
  isConfirmLoading.value = true;
  await userStore.addUserToOrganization(addToOrgForm.value);
  addToOrgDialog.value = false;
  isConfirmLoading.value = false;
  resetForm();
  getAllUserData();
};
const getAllUserData = async () => {
  isLoading.value = true;
  await userStore.getUsersList();
  isLoading.value = false;
};
onMounted(() => {
  getAllUserData();
});
</script>
