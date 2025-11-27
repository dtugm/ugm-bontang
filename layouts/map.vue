<template>
  <v-layout>
    <div class="relative">
      <v-navigation-drawer
        flat
        v-model="drawer"
        :rail="rail"
        class="bg-white border-r border-gray-200 transition-all duration-300"
        :width="260"
        permanent
      >
        <!-- Toggle Button -->
        <div class="absolute -right-3 top-16 z-10">
          <v-btn
            @click="rail = !rail"
            icon
            size="x-small"
            color="tertiary"
            class="shadow-md bg-white"
            elevation="2"
          >
            <v-icon>{{
              rail ? "mdi-chevron-right" : "mdi-chevron-left"
            }}</v-icon>
          </v-btn>
        </div>

        <!-- Header Logo - Updated -->
        <v-list class="bg-gradient-to-r from-primary/5 to-tertiary/5">
          <v-list-item :class="rail ? 'py-3 px-2' : 'py-3'">
            <template #prepend>
              <div :class="rail ? 'mx-auto' : 'relative'">
                <v-img
                  src="https://digital-twin-ugm.s3.ap-southeast-1.amazonaws.com/assets/Logo_3.png"
                  :width="rail ? 40 : 45"
                  :height="rail ? 40 : 45"
                  class="rounded-lg shadow-md transition-all duration-300"
                  cover
                />
                <div
                  v-if="!rail"
                  class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                ></div>
              </div>
            </template>

            <v-list-item-title v-if="!rail">
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

            <!-- Tooltip untuk Rail Mode -->
            <v-tooltip v-if="rail" activator="parent" location="end">
              <div class="text-center">
                <div class="font-bold">Bontang</div>
                <div class="text-xs">Validasi Data PBB Kota Bontang</div>
              </div>
            </v-tooltip>
          </v-list-item>
        </v-list>

        <!-- Divider -->
        <v-divider class="mb-2"></v-divider>

        <!-- Sidebar Content -->
        <div class="overflow-y-auto" style="height: calc(100vh - 180px)">
          <AppSidebar :rail="rail" />
        </div>

        <template v-slot:append>
          <AppButtonSignOut :rail="rail" />
        </template>
      </v-navigation-drawer>
    </div>

    <!-- Main Content Area -->
    <v-main class="bg-grayish">
      <!-- Page Content -->
      <slot />
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import stringHelper from "~/app/helper/string.helper";
const authStore = useAuthenticationStore();
const route = useRoute();
const drawer = ref(true);
const rail = ref(false);
const pathName = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "Dashboard";
});
</script>
