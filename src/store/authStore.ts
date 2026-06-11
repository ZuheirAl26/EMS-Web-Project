export type AuthState = {
  isAuthenticated: boolean
  token: string | null
}

export const authStore: AuthState = {
  isAuthenticated: false,
  token: null,
}
