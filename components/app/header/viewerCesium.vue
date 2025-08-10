<template>
  <div class="absolute top-0 w-full z-10 bg-black flex justify-between">
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
    <div>Digital Twin Bontang</div>
    <div>
      <v-img src="/logo/Logo_1.png" width="30" height="30"> </v-img>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
</script>
