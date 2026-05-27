/** Role của user trả về từ backend, dùng để chặn admin portal với tài khoản thường. */
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

/** Trạng thái tài khoản người dùng trong hệ thống. */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}

/** Giới tính của user, đồng bộ với backend enum. */
export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

/** User hiện tại được backend trả về sau login/getMe. */
export interface UserResponse {
  id: number
  firebaseUid: string
  fullName: string
  email: string
  phone: string
  avatarUrl: string | null
  reputationScore: number
  role: UserRole
  status: UserStatus
  gender: GenderEnum
  createdAt: string
}

/** Kiểu response đăng nhập nếu backend trả token + user trong cùng payload. */
export interface LoginResponse {
  token: string
  user: UserResponse
}
