export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface UserResponse {
  id: number;
  firebaseUid: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  reputationScore: number;
  role: UserRole;
  status: UserStatus;
  gender: Gender;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}