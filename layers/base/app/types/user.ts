export interface User {
  id: string
  username: string
  email: string
  role: string
  avatar: string
  bio: string | null
  createdAt: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}
