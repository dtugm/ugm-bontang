<template>
  <div class="absolute top-0 w-full z-10 glass-div flex justify-between">
    <v-btn
      size="30"
      variant="flat"
      class="text-none rounded-0"
      icon
      color="black"
      @click="router.back()"
    >
      <v-icon>mdi-keyboard-backspace</v-icon>
    </v-btn>
    <div>{{ title }}</div>
    <div>
      <v-img src="/logo/Logo_1.png" width="30" height="30"> </v-img>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
interface Props {
  title?: string;
  icon?: string;
  buttonColor?: string;
}
const props = withDefaults(defineProps<Props>(), {
  title: "Digital Twin Bontang",
  icon: "mdi-file",
  buttonColor: "tertiary",
});
</script>
<style scoped>
.glass-div {
  background: rgba(255, 255, 255, 0.3); /* putih transparan */
  padding: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* shadow halus */
  backdrop-filter: blur(10px); /* efek kaca */
  -webkit-backdrop-filter: blur(10px); /* untuk Safari */
  border: 1px solid rgba(255, 255, 255, 0.2); /* garis tipis biar kayak kaca */
}
</style>
