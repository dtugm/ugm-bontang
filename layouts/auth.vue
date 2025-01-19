<template>
  <div id="app" class="theme-default">
    <main>
      <div class="flex h-dvh">
        <div
          class="auth-illustrations w-1/2 flex items-center justify-center flex-col bg-blue"
        >
          <!-- <img
            src="/images/illustrations/auth.png"
            width="412"
            class="mr-[65px]"
          /> -->
          <div class="flex flex-col gap-5 text-white w-[402px]">
            <h2 class="m-0 text-lg font-bold">
              <span>PMT SMART AI</span>
            </h2>
            <p>
              Project Management tools for internet access and service
              monitoring analytic
            </p>
            <p class="text-sm">© 2024 Bakti. All rights reserved.</p>
          </div>
        </div>
        <div class="w-1/2 py-[105px] px-[108px]">
          <slot />
          <div class="text-center text-grey">
            <!-- <AppVersion /> -->
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
