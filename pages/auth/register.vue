<template>
  <v-card width="500" variant="flat">
    <v-card-text>
      <div class="justify-center flex flex-col items-center mb-5">
        <AppTextH2 class="text-[25px]" color="secondary">
          Register your Account on <br />
          <span class="text-primary">Website Monitoring</span></AppTextH2
        >
        <p>Pekerjaan Validasi Data PBB Kota Bontang</p>
      </div>
      <v-form
        ref="registration"
        v-model="valid"
        @submit.prevent="onSubmit"
        id="registration-form"
      >
        <div class="flex flex-col py-3 text-start">
          <div>
            <label>First Name</label>
            <v-text-field
              v-model="formData.firstName"
              placeholder="First Name"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
            ></v-text-field>
          </div>
          <div>
            <label>Last Name</label>
            <v-text-field
              v-model="formData.lastName"
              placeholder="Last Name"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
            ></v-text-field>
          </div>
          <div>
            <label>Username</label>
            <v-text-field
              v-model="formData.username"
              placeholder="Username"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
            ></v-text-field>
          </div>
          <div>
            <label>Email</label>
            <v-text-field
              v-model="formData.email"
              placeholder="Email"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
            ></v-text-field>
          </div>
          <div>
            <label>Password</label>
            <v-text-field
              v-model="formData.password"
              placeholder="Password"
              density="compact"
              variant="outlined"
              :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              @click:append-inner="visible = !visible"
              :rules="[rules.required]"
            ></v-text-field>
          </div>
          <AppButton
            :loading="isLoading"
            type="submit"
            color="tertiary"
            label="Register"
            class="w-full"
          />
        </div>
      </v-form>
      <div class="text-center mt-3">
        <span class="text-sm">
          Already have an account?
          <NuxtLink to="/auth/login" class="text-primary font-semibold">
            Login
          </NuxtLink>
        </span>
      </div>
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
const registration: any = ref(null);
const rules = {
  required: (v: any) => !!v || "Wajib diisi",
};
const onSubmit = async () => {
  if (!registration.value) return;
  const { valid: formValid } = await registration.value.validate();
  if (!formValid) return;
  await do_login();
};
const appStore = useAppStore();
const authenticationStore = useAuthenticationStore();
const formData = ref({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
});
function isEmail(email: any) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
const do_login = async () => {
  isLoading.value = true;
  try {
    const payload = formData.value;
    console.log(payload);
    await authenticationStore.registerAccount(payload);
    appStore.toastSuccess("Registration Success");
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    appStore.toastError("Registration Failed");
  }
};
const isLoading = ref(false);
const visible = ref(false);
</script>
