<template>
  <v-card width="500" variant="flat">
    <v-card-text>
      <div class="justify-center flex flex-col items-center mb-5">
        <AppTextH2 class="text-[25px]" color="secondary"
          >Welcome to
          <span class="text-primary">Dashboard Monitoring</span></AppTextH2
        >
        <p>Pekerjaan Validasi Data PBB Kota Bontang</p>
      </div>
      <v-form
        ref="login"
        v-model="valid"
        @submit.prevent="onSubmit"
        id="login-form"
      >
        <div class="flex flex-col gap-3 py-3">
          <v-text-field
            v-model="username"
            label="Email/Username"
            density="compact"
            variant="outlined"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            density="compact"
            variant="outlined"
            :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            @click:append-inner="visible = !visible"
            :rules="[rules.required]"
          ></v-text-field>
          <AppButton
            :loading="isLoading"
            type="submit"
            color="tertiary"
            label="Sign In"
            class="w-full"
          />
        </div>
      </v-form>
      <div class="flex mt-5">
        <v-img
          height="75"
          class="bg-white"
          src="/logo/Logo_Typography_1.webp"
        ></v-img>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
const valid = ref(false);
const login: any = ref(null);

const rules = {
  required: (v: any) => !!v || "Wajib diisi",
};

const onSubmit = async () => {
  if (!login.value) return;
  const { valid: formValid } = await login.value.validate();
  if (!formValid) return;
  await do_login();
};
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
