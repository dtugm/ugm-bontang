// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";
import { bontangLight } from "~/app/constant/color";
const bontangLightTheme: ThemeDefinition = {
  dark: false,
  colors: bontangLight,
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    defaults: {
      global: {
        style: {
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        },
      },
    },
    theme: {
      defaultTheme: "bontangLightTheme",
      themes: { bontangLightTheme },
    },
  });
  app.vueApp.use(vuetify);
});
