import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { model, Schema } from 'mongoose';
import config from '../../config';
import AppError from '../../Errors/AppError';
import { TUser, UserModel } from './user.interface';

export const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      select: 0,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
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

userSchema.statics.isUserExistByEmail = async function (email: string) {
  const user = await this.findOne({ email });
  return user ? true : false;
};

userSchema.statics.isUserPasswordMatched = async function (
  email: string,
  userPassword: string,
) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const isPasswordMatched = bcrypt.compareSync(userPassword, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  const userObj = user.toObject();

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = userObj;

  return userWithoutPassword;
};

export const User = model<TUser, UserModel>('User', userSchema);
