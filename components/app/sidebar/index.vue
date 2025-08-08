<template>
  <v-list>
    <v-list-item>
      <template #prepend>
        <v-img
          src="https://digital-twin-ugm.s3.ap-southeast-1.amazonaws.com/assets/Logo_3.png"
          width="40"
          height="40"
          class="rounded-0"
          cover
        />
      </template>

      <v-list-item-title>
        <AppTextH3 class="px-4" color="tertiary">Bontang</AppTextH3>
      </v-list-item-title>
    </v-list-item>
  </v-list>
  <v-list mandatory density="compact" nav @update:selected="changePage">
    <template v-for="(menu, index) in filteredMenus" :key="index">
      <v-list-group v-if="menu.sub_menu">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="menu.prepend_icon"
            :title="menu.title"
          >
          </v-list-item>
        </template>
        <v-list-item
          v-for="(subMenu, index) in menu.sub_menu"
          :key="subMenu.path"
          :active="subMenu.path === selectedTab"
          :prepend-icon="subMenu.prepend_icon"
          :title="subMenu.title"
          :value="subMenu.path"
          class="rounded-left"
          active-color="tertiary"
        >
          <template v-slot:prepend>
            <v-avatar>
              <v-icon color="tertiary">{{ subMenu.prepend_icon }}</v-icon>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list-group>
      <v-list-item
        class="rounded-left"
        v-else
        :ripple="false"
        :prepend-icon="menu.prepend_icon"
        :title="menu.title"
        :value="menu.path"
        :active="
          route.path === menu.path || route.path.startsWith(menu.path + '/')
        "
        active-color="tertiary"
      ></v-list-item>
    </template>
  </v-list>
</template>
<script lang="ts" setup>
import { filterMenuByAccess } from "~/app/helper/auth.helper";
import userMenusConstant from "~/app/constant/user/userMenus.constant";
const authStore = useAuthenticationStore();
const filteredMenus = computed(() =>
  filterMenuByAccess(userMenusConstant.All_Menus, authStore.userAccessPaths)
);
const route = useRoute();
const selectedTab = ref(route.path);
const changePage = (item: any) => {
  selectedTab.value = item[0];
  navigateTo(item[0]);
};
</script>
<style scoped>
.rounded-left {
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}
</style>
