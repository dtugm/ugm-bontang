import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
const toast = useToast();
export const useAppStore = defineStore("app", () => {
  const date = new Date();
  const currentDate = () => {
    return new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const toastSuccess = (message: string) => {
    toast.success(message);
  };
  const toastError = (message: string) => {
    toast.error(message);
  };
  const sendUpdateEmail = async (
    namaPengirim: string,
    targetEmail: string,
    subject: string,
    message: string
  ) => {
    const apiKey: any = useRuntimeConfig().public.brevoApiKey;
    try {
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: namaPengirim, email: "digitaltwinugm@gmail.com" },
          to: [{ email: targetEmail }],
          subject: subject,
          htmlContent: `<p>${message}</p>`,
        }),
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return {
    toastSuccess,
    toastError,
    currentDate,
    sendUpdateEmail,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
