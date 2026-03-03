import type { LoginResponse, UserResponse } from '#/types/auth'
import axiosClient from '#/utils/axiosClient'
import axios from 'axios'

export const authApi = {
  login: (): Promise<UserResponse> =>
    axiosClient.post('api/auth/login').then((res) => res.data),

  getMe: (): Promise<UserResponse> =>
    axiosClient.get('api/users/me').then((res) => res.data),
}
