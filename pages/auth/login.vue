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
      <!-- <p>Selamat! Anda adalah orang yang terpilih. hehe..</p> -->
    </div>
    <!-- <v-divider class="py-2" color="primary" :thickness="2">or</v-divider> -->
    <v-form id="login-form" @submit.prevent="Login()">
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
          @click="Login"
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
function isEmail(email: any) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
const isLoading = ref(false);
const db = useFirestore();
// const email = ref("");
const username = ref("");
const password = ref("");
definePageMeta({
  layout: "auth",
});
const visible = ref(false);
const auth = getAuth();
const appStore = useAppStore();
const router = useRouter();
const Login = async () => {
  isLoading.value = true;
  let email;
  if (!isEmail(username.value)) {
    const usersRef = collection(db, "usernames");
    const q = query(usersRef, where("username", "==", username.value));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("Username tidak ditemukan");
      return;
    }
    const userData = querySnapshot.docs[0].data();
    email = userData.email;
  } else {
    email = username.value;
  }
  try {
    signInWithEmailAndPassword(auth, email, password.value)
      .then((userCredential) => {
        appStore.toastSuccess("Login Success!");
        isLoading.value = false;
        // const user = userCredential.user;
        router.replace("/");
      })
      .catch((error) => {
        appStore.toastError("Login Failed");
      });
  } catch (error) {}
};
</script>
