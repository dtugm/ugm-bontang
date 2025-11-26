export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) return;

  const token = sessionStorage.getItem("token");

  // Daftar rute yang boleh diakses tanpa token
  const whitelist = [
    "/auth/login",
    "/auth/register",
    "/forgot-password",
    "/reset-password",
    "/", // kalau mau halaman utama juga bebas
  ];

  // Jika sudah ada token, cegah masuk ke login page
  if (token && to.path === "/auth/login") {
    return navigateTo("/");
  }

  // Jika tidak ada token dan rutenya TIDAK ada di whitelist → arahkan ke login
  if (!token && !whitelist.includes(to.path)) {
    return navigateTo("/auth/login");
  }
});
