import Toast, { POSITION, useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
  position: POSITION.TOP_RIGHT,
};
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, options);
  return {
    provide: {
      toast: useToast(),
    },
  };
});
