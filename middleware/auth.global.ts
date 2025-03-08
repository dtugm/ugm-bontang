export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const token = sessionStorage.getItem("token");
    if (token && to.name === "auth-login") {
      return navigateTo("/");
    }
    if (!token && to.name !== "auth-login") {
      return navigateTo("/auth/login");
    }
  }
});
