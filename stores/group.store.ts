import groupApi from "~/app/api/group.api";
import groupConstant from "~/app/constant/group.constant";
import { defineStore } from "pinia";
export const useGroup = defineStore("group", () => {
  const lidarGroup = ref();
  console.log("first");
  const getLidarGroup = async () => {
    const groupId = groupConstant.groupId.lidar;

    await groupApi.get_group_info_by_id(groupId).then((resp) => {
      console.log(resp);
      lidarGroup.value = resp;
    });
  };
  getLidarGroup();
  return {
    getLidarGroup,
    lidarGroup,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGroup, import.meta.hot));
}
