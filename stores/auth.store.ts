export const useAuthStore = defineStore("auth", () => {
  const user = useCurrentUser();
  // async function updateDisplayName(newName) {
  //   if (user.value) {
  //     try {
  //       await updateProfile(user.value, {
  //         displayName: "Test Display Name",
  //       });
  //       alert("Display name updated successfully!");
  //     } catch (error) {
  //       console.error("Error updating display name:", error);
  //     }
  //   } else {
  //     console.error("No user is logged in.");
  //   }
  // }
  return {
    user,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
