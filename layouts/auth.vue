<template>
  <div id="app" class="theme-default h-screen">
    <main>
      <div class="flex flex-col md:flex-row min-h-screen">
        <!-- Container Kiri (Gambar) -->
        <div
          class="hidden md:flex md:w-1/2 w-full items-center justify-center relative"
          style="
            background-image: url('/illustration/LoginPage_Background.jpg');
          "
        >
          <!-- <v-img
            src="/illustration/LoginPage_Background.jpg"
            class="absolute inset-0 w-full h-full object-cover"
            cover
          ></v-img> -->
        </div>

        <!-- Container Kanan (Konten/Form) -->
        <div
          class="md:w-1/2 w-full flex h-screen items-center justify-center p-5 lg:px-20"
        >
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>
