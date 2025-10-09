// Placeholder hook
export function useAuth() {
  return {
    user: null,
    isAuthenticated: false,
    activeCountryId: null,
    effectiveCountryId: null,
    isGlobalAdmin: false,
    login: async () => false,
    logout: () => {},
    updateUser: () => {},
    switchCountry: () => {}
  };
}