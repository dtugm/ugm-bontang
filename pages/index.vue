<template>
  <DashboardWorker v-if="authStore.user.email !== 'dhiasdmn@gmail.com'" />
  <DashboardAdmin v-else />
</template>

<script setup>
const authStore = useAuthStore();
</script>
