/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../error/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';


export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized for access faculty !',
      );
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;
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

    // if (!(await User.isPasswordMatched(user?.password, user?.password))) {
    //   throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
    // }

    if(user.passwordChangeAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangeAt, iat as number)){
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Your are not authorized!',
      );
    }



    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Your are not authorized user!',
      );
    }

    req.user = decoded as JwtPayload;
    next();

    // jwt.verify(
    //   token,
    //   config.jwt_access_secret as string,
    //   function (err, decoded) {
    //     if (err) {
    //       throw new AppError(
    //         httpStatus.UNAUTHORIZED,
    //         'You are not authorized!',
    //       );
    //     }
    //     const role = (decoded as JwtPayload).role;
    //     if (requiredRoles && !requiredRoles.includes(role)) {
    //       throw new AppError(
    //         httpStatus.UNAUTHORIZED,
    //         'Your are not authorized user!',
    //       );
    //     }

    //     req.user = decoded as JwtPayload;
    //     next();
    //   },
    // );
  });
};
