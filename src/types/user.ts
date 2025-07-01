export interface User {
  id: string
  username: string
  email: string
  role: UserRole;
  createdAt: string;//用户账号创立的时间
}

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

export interface UserProfile {
  userId: string,
  username: string,
  email: string,
  role: string,
  registerTime: string,
  lastLoginTime: string,
}
