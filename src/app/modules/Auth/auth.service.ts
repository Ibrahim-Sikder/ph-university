/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import { AppError } from '../../error/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistByCustomId(payload.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found ');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is blocked!');
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  // const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
  //   expiresIn: '10d',
  // });
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  // const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret as string, {
  //   expiresIn: config.jwt_refresh_expires_in,
  // });
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );


  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistByCustomId(userData.userId);


  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found ');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is blocked!');
  }

  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  const result = await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );

  return result;
};
const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;
  const user = await User.isUserExistByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found ');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is blocked!');
  }

  if (
    user.passwordChangeAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangeAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Your are not authorized!');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  const user = await User.isUserExistByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found ');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is blocked!');
  }


  
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );


  const resetUILink = `${config.reset_pass_uiLink}?id=${user.id}&token=${accessToken}`
  sendEmail(user.email,resetUILink)

  return resetUILink;





};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  const user = await User.isUserExistByCustomId(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found ');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is blocked!');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if(payload.id !== decoded.userId){
    throw new AppError(httpStatus.FORBIDDEN,'You are forbidden')
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );




  const result = await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );
  return result;



};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
