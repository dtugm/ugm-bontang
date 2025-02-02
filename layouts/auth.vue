<template>
  <div id="app" class="theme-default h-screen">
    <main>
      <div class="flex flex-col md:flex-row min-h-screen">
        <!-- Container Kiri (Gambar) -->
        <div
          class="hidden md:flex md:w-1/2 w-full items-center justify-center relative"
          style="background-image: url('/illustration/peta_bontang_bg.png')"
        >
          <!-- <v-card width="600">
            <v-card-text>
              <div class="flex items-center gap-3">
                <v-img height="100" width="100" src="/logo/Logo_1.png"></v-img>
                <div>
                  <AppTextH2>BONTANG</AppTextH2>
                  <p class="text-lg">
                    Kegiatan Pemodelan 3D Bangunan dan Infrastruktur serta
                    Validasi Data PBB
                  </p>
                </div>
              </div>
            </v-card-text>
          </v-card> -->

          <v-img
            width="400"
            height="600"
            src="/logo/kota_bontang_putih.png"
            :style="`transform: rotate(-15deg); transition: 0.3s;`"
            class="mr-[100px]"
          ></v-img>
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
<style scoped>
.rotate-image {
  transition: transform 0.3s ease-in-out;
  transform-origin: center;
}
</style>
