<template>
  <v-card width="500">
    <v-card-text>
      <div class="justify-center flex flex-col items-center mb-5">
        <AppTextH2 class="text-[25px]" color="secondary"
          >Welcome to
          <span class="text-primary">Dashboard Monitoring</span></AppTextH2
        >
        <p>Pekerjaan Validasi Data PBB Kota Bontang</p>
      </div>
      <v-form id="login-form">
        <v-text-field
          v-model="username"
          label="Email/Username"
          density="compact"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
          v-model="password"
          label="Password"
          density="compact"
          variant="outlined"
          :type="visible ? 'text' : 'password'"
          @click:append-inner="visible = !visible"
        ></v-text-field>
        <div class="flex flex-col gap-2">
          <AppButton
            :loading="isLoading"
            color="tertiary"
            @click="do_login"
            label="Sign In"
            class="w-full"
          />
        </div>
      </v-form>
      <div class="flex mt-5">
        <v-img
          height="75"
          class="bg-white"
          src="/logo/Logo_Typography_1.png"
        ></v-img>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
const appStore = useAppStore();
const authenticationStore = useAuthenticationStore();
const username = ref("");
const password = ref("");
function isEmail(email: any) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
const do_login = async () => {
  isLoading.value = true;
  try {
    const payload = isEmail(username.value)
      ? { email: username.value, password: password.value }
      : { username: username.value, password: password.value };
    await authenticationStore.login(payload);
    appStore.toastSuccess("Login Success!");
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    appStore.toastError("Login Failed");
  }
};
const isLoading = ref(false);
const visible = ref(false);
</script>
