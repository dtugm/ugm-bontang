import authApi from "~/app/api/auth.api";
import { groupAccessMap } from "~/app/constant/user/userAccess.constant";
export const useAuthenticationStore = defineStore("authentication", {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem("user") || "null"),
    token: sessionStorage.getItem("token") || "",
  }),
  getters: {
    // isAuthenticated: (state) => !!state.token,

    userGroupNames: (state): string[] => {
      return (
        state.user?.groups.map((group: IGroupsItemField) => group.name) || []
      );
    },

    userAccessPaths: (state): string[] => {
      const paths = new Set<string>();

      state.user?.groups.forEach((group: IGroupsItemField) => {
        const access = groupAccessMap[group.name] || [];
        access.forEach((path) => paths.add(path));
      });

      return Array.from(paths);
    },
  },
  actions: {
    setUser(userData: any) {
      this.user = userData;
      sessionStorage.setItem("user", JSON.stringify(userData));
    },
    setToken(token: string) {
      this.token = token;
      sessionStorage.setItem("token", token);
    },

    async login(payload: Partial<ILoginPayload>) {
      try {
        const response = await authApi.login(payload);
        if (response && response.token) {
          this.token = response.token;
          this.setToken(response.token);
          this.setUser(response.user);
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
      this.user = null;
      this.token = "";
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
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
