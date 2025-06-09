import groupApi from "~/app/api/group.api";
import groupConstant from "~/app/constant/group.constant";
import { defineStore } from "pinia";
export const useGroup = defineStore("group", () => {
  const groupsItems = ref([]);
  const getAllGroups = async () => {
    const resp = await groupApi.get_all_groups();
    groupsItems.value = resp;
  };
  const deleteDataGroups = async (id: string) => {
    const resp = await groupApi.delete_group(id);
  };
  const addNewGroup = async (payload: IUploadGroupsParams) => {
    const resp = await groupApi.add_new_group(payload);
    console.log(resp);
  };
  return {
    // All Groups
    getAllGroups,
    groupsItems,
    deleteDataGroups,

    addNewGroup,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGroup, import.meta.hot));
}
