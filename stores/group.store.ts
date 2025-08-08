import groupApi from "~/app/api/group.api";
import groupConstant from "~/app/constant/group.constant";
import { defineStore } from "pinia";
import { apiWrapper } from "~/app/helper/api.helper";
export const useGroup = defineStore("group", () => {
  const groupsItems = ref([]);
  const getAllGroups = async () => {
    const resp = await groupApi.get_all_groups();
    groupsItems.value = resp;
  };
  const actBtnLoading = ref(false);
  const deleteDataGroups = async (id: string) => {
    actBtnLoading.value = true;
    await apiWrapper(() => groupApi.delete_group(id), {
      successMessage: "Berhasil Mengahpus Data",
    }).then(() => {
      actBtnLoading.value = false;
    });
  };
  const addNewGroup = async (payload: IUploadGroupsParams) => {
    actBtnLoading.value = true;
    await apiWrapper(() => groupApi.add_new_group(payload), {
      successMessage: "Group Berhasil Ditambahkan",
    }).then(() => {
      actBtnLoading.value = false;
    });
  };

  const addMemberToGroup = async (id: string, payload: any) => {
    actBtnLoading.value = true;
    await apiWrapper(() => groupApi.add_member_to_group(id, payload), {
      successMessage: "Member Berhasil Ditambahkan",
    }).then(() => {
      actBtnLoading.value = false;
    });
  };
  return {
    // All Groups
    getAllGroups,
    groupsItems,
    deleteDataGroups,
    addNewGroup,
    addMemberToGroup,
    actBtnLoading,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGroup, import.meta.hot));
}
