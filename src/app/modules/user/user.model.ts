import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { model, Schema } from 'mongoose';
import config from '../../config';
import AppError from '../../Errors/AppError';
import { TUser, UserModel } from './user.interface';

export const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this as TUser;
  user.password = await bcrypt.hashSync(
    user.password,
    Number(config.bcrypt_salt),
  );
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistByCustomId = async function (id: string) {
  const user = await this.findOne({ id });
  return !!user; // !!user === user ? true : false
};

userSchema.statics.isUserDeleted = async function (id: string) {
  const user = await this.findOne({ id });
  return user?.isDeleted;
};

userSchema.statics.isUserBlocked = async function (id: string) {
  const user = await this.findOne({ id });
  return user?.status === 'blocked';
};

userSchema.statics.isUserPasswordMatched = async function (
  id: string,
  password: string,
) {
  const user = await this.findOne({ id }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const isPasswordMatched = bcrypt.compareSync(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  return user;
};

userSchema.statics.isJWTIssuedBeforePasswordChange = async function (
  passwordChangeTimeStamp: Date,
  jwtIssuedTimeStamp: number,
) {
  return passwordChangeTimeStamp.getTime() / 1000 > jwtIssuedTimeStamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
