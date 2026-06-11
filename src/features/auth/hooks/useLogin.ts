import { login, type LoginPayload } from '../api'

export function useLogin() {
  return {
    login: (payload: LoginPayload) => login(payload),
  }
}
