export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const token = localStorage.getItem("authToken");
    if (token && to.name === "auth-login") {
      return navigateTo("/");
    }
    if (!token && to.name !== "auth-login") {
      return navigateTo("/auth/login");
    }
  }
});
