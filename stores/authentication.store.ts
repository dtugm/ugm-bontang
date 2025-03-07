import authApi from "~/app/api/auth.api";
export const useAuthenticationStore = defineStore("authentication", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("userData") ?? "null"),
    token: localStorage.getItem("authToken") || null,
  }),

  actions: {
    setUser(user: any) {
      this.user = user;
    },

    async login(payload: ILoginPayload) {
      console.log("login");
      try {
        const response = await authApi.login(payload);
        if (response && response.token) {
          this.token = response.token;
          localStorage.setItem("authToken", response.token);
          localStorage.setItem("userData", JSON.stringify(response.user));
        }
        setTimeout(() => {
          navigateTo("/");
        }, 2000);
        return response;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    async logout() {
      localStorage.clear();
      navigateTo("/auth/login");
    },
    isAuthenticated() {
      return !!this.token;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
