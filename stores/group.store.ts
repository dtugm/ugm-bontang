import groupApi from "~/app/api/group.api";
import groupConstant from "~/app/constant/group.constant";
import { defineStore } from "pinia";
export const useGroup = defineStore("group", () => {
  const groupsItems = ref([]);
  const getAllGroups = async () => {
    const resp = await groupApi.get_all_groups();
    groupsItems.value = resp;
  };
  return {
    // All Groups
    getAllGroups,
    groupsItems,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGroup, import.meta.hot));
}
