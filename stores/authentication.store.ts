import authApi from "~/app/api/auth.api";
import organizationApi from "~/app/api/organization.api";
import { groupAccessMap } from "~/app/constant/user/userAccess.constant";
export const useAuthenticationStore = defineStore("authentication", {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem("user") || "null"),
    token: sessionStorage.getItem("token") || "",
    groups: JSON.parse(sessionStorage.getItem("groups") || "null"),
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
    setGroup(groups: string) {
      this.groups = groups;
      sessionStorage.setItem("groups", JSON.stringify(groups));
    },
    async registerAccount(payload: Partial<ILoginPayload>) {
      try {
        const response = await authApi.register(payload);
        await organizationApi.add_user_to_organization({
          email: payload.email,
          role: "Member",
        });
        setTimeout(() => {
          navigateTo("/auth/login");
        }, 2000);
        return response;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    async login(payload: Partial<ILoginPayload>) {
      try {
        const response = await authApi.login(payload);

        if (response && response.token) {
          this.token = response.token;
          this.setToken(response.token);
          this.setUser(response.user);
          this.setGroup(response.user.groups);
        }
        const patchResponse = await organizationApi.patch_user_to_bontang(
          "7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3"
        );
        if (patchResponse && patchResponse.accessToken) {
          this.token = patchResponse.accessToken;
          this.setToken(patchResponse.accessToken);
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
