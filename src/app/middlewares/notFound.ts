/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const statusCode = 500;

  return res.status(statusCode).json({
    success: false,
    message: 'API not found',
    error: '',
  });
};

export default notFound;
