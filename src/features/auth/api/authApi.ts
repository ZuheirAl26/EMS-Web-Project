export type LoginPayload = {
  email: string
  password: string
}

export async function login(payload: LoginPayload) {
  return Promise.resolve({ token: `${payload.email}:demo-token` })
}
