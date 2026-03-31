export const storage = {
  getLoginMobileNumber: () => localStorage.getItem("login_mobile_number"),
  setToken: (token) => localStorage.setItem("access_token", token),
  clearAuthArtifacts: () => {
    localStorage.removeItem("auth_state");
    localStorage.removeItem("code_verifier");
  },
  setProfileList: (profiles) =>
    localStorage.setItem("profiles", JSON.stringify(profiles)),
  setSelectedProfile: (profile) =>
    localStorage.setItem("selectedProfile", JSON.stringify(profile)),
};
