import organizationsApi from "~/app/api/auth/organizations.api";
import usersApi from "~/app/api/users.api";
import { apiWrapper } from "~/app/helper/api.helper";

export const useUsersStore = defineStore("usersStore", () => {
  const usersList = ref([]);
  const getUsersList = async () => {
    const resp = await usersApi.get_all_users();
    usersList.value = resp.users;
  };
  const addUserToOrganization = async (payload: any) => {
    await apiWrapper(() => organizationsApi.add_user_to_organization(payload), {
      successMessage: "Success add user to organization",
    });
  };
  return {
    getUsersList,
    usersList,

    addUserToOrganization,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
