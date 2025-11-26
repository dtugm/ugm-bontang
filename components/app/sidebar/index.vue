<template>
  <v-list class="bg-gradient-to-r from-primary/5 to-tertiary/5">
    <v-list-item class="py-3">
      <template #prepend>
        <div class="relative">
          <v-img
            src="https://digital-twin-ugm.s3.ap-southeast-1.amazonaws.com/assets/Logo_3.png"
            width="45"
            height="45"
            class="rounded-lg shadow-md"
            cover
          />
          <div
            class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
          ></div>
        </div>
      </template>
      <v-list-item-title>
        <div class="pl-2">
          <AppTextH3
            class="text-[25px] font-bold bg-gradient-to-r from-tertiary to-primary bg-clip-text text-transparent mt-1"
          >
            Bontang
          </AppTextH3>
          <p class="text-[10px] text-gray-600 -mt-1">
            Validasi Data PBB Kota Bontang
          </p>
        </div>
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
