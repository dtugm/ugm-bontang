<template>
  <v-container
    width="500"
    class="shadow-md md:shadow-none rounded-md py-12 px-5 lg:px-15"
  >
    <div class="pb-5 justify-center flex flex-col items-center mb-5">
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
    <diva class="flex mt-5">
      <v-img
        height="75"
        class="bg-white"
        src="/logo/Logo_Typography_1.png"
      ></v-img>
    </diva>
  </v-container>
</template>
<script setup lang="ts">
const appStore = useAppStore();
const authenticationStore = useAuthenticationStore();
const username = ref("");
const password = ref("");
const do_login = async () => {
  isLoading.value = true;
  try {
    const payload = {
      email: username.value,
      password: password.value,
    };
    await authenticationStore.login(payload);
    appStore.toastSuccess("Login Success!");
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    appStore.toastError("Login Failed");
  }
};
function isEmail(email: any) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
const isLoading = ref(false);

definePageMeta({
  layout: "auth",
});
const visible = ref(false);
// const auth = getAuth();
// const appStore = useAppStore();
// const router = useRouter();
// const Login = async () => {
//   isLoading.value = true;
//   let email;
//   if (!isEmail(username.value)) {
//     const usersRef = collection(db, "usernames");
//     const q = query(usersRef, where("username", "==", username.value));
//     const querySnapshot = await getDocs(q);
//     if (querySnapshot.empty) {
//       alert("Username tidak ditemukan");
//       return;
//     }
//     const userData = querySnapshot.docs[0].data();
//     email = userData.email;
//   } else {
//     email = username.value;
//   }
//   try {
//     signInWithEmailAndPassword(auth, email, password.value)
//       .then((userCredential) => {
//         appStore.toastSuccess("Login Success!");
//         isLoading.value = false;
//         // const user = userCredential.user;
//         router.replace("/");
//       })
//       .catch((error) => {
//         appStore.toastError("Login Failed");
//       });
//   } catch (error) {}
// };
</script>
