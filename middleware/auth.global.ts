export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser();
  console.log(user);
  if (user && to.name === "auth-login") {
    return navigateTo("/");
  }
  if (!user && to.name !== "auth-login") {
    return navigateTo("/auth/login");
  }
});
