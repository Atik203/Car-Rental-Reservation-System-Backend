import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  phone: string;
  address: string;
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistByEmail: (email: string) => Promise<boolean>;
  isUserDeleted: (email: string) => Promise<boolean>;
  isUserPasswordMatched: (email: string, password: string) => Promise<TUser>;
}

export type TUserRole = keyof typeof USER_ROLE;
