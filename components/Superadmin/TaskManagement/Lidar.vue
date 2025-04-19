<template>
  <v-container>
    <!-- <AppInputText v-model="addUserForm.email" label="email" /> -->
    <AppInputAutocomplete
      v-model="addUserForm.email"
      :items="usersConstant.employee_user"
    />
    <AppInputAutocomplete
      v-model="addUserForm.role"
      label="role"
      :items="['Member', 'Admin']"
    />
    <AppButton @click="addUsers" />
  </v-container>
  <v-container>
    <AppTextH2>Group</AppTextH2>
    <!-- <AppInputText v-model="addUserForm.email" label="email" /> -->
    <AppInputAutocomplete
      v-model="addMemberForm.userId"
      item-title="email"
      item-value="id"
      :items="allUsers"
    />
    <AppInputAutocomplete
      v-model="addMemberForm.role"
      label="role"
      :items="['LEADER', 'MEMBER']"
    />
    {{ group }}
    <AppInputAutocomplete v-model="group" label="role" :items="groupID" />

    <AppButton @click="addToGroup" />
  </v-container>
</template>
<script setup>
import groupApi from "~/app/api/group.api";
import organizationApi from "~/app/api/organization.api";
import usersApi from "~/app/api/users.api";
import usersConstant from "~/app/constant/users.constant";

const addUserForm = ref({
  email: "",
  role: "",
});
const addUsers = async () => {
  const resp = await organizationApi.add_user_to_organization(
    addUserForm.value
  );
  console.log(addUserForm.value);
  console.log(resp);
};

const addMemberForm = ref({});
const allUsers = ref([]);
const getAllUsers = async () => {
  await usersApi.get_all_users().then((resp) => {
    console.log(resp);
    allUsers.value = resp.users;
  });
};
getAllUsers();
const group = ref();
const groupID = ref([
  {
    title: "Lidar",
    value: "7d8533c5-5d84-45e8-8812-77aa6cead296",
  },
  {
    title: "3d Model",
    value: "58e9e247-992d-414c-b733-3e6931bc6219",
  },
]);
const addToGroup = async () => {
  await groupApi.add_member_to_group(group.value, addMemberForm.value);
  //   console.log(addMemberForm.value);
  //   console.log(group.value);
};
</script>
