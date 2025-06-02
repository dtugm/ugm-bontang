import usersApi from "~/app/api/users.api";

export const useUsersStore = defineStore("usersStore", () => {
  const usersList = ref([]);
  const getUsersList = async () => {
    const resp = await usersApi.get_all_users();
    usersList.value = resp.users;
  };
  return {
    getUsersList,
    usersList,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
