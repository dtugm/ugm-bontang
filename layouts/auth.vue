<template>
  <div id="app" class="theme-default">
    <main>
      <div class="flex h-dvh">
        <div class="md:w-1/2 md:p-10 flex items-center justify-end pr-0">
          <v-img src="/illustration/home_illustration.svg"></v-img>
        </div>
        <div
          class="md:w-1/2 w-full items-center justify-center flex p-5 lg:px-20"
        >
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>
