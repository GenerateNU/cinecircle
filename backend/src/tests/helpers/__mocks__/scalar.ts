// Mock for @scalar/express-api-reference
// This module is mocked in tests because it's an ES module that causes issues with Jest
// we don't need to test the documentation middleware functionality

import { Request, Response, NextFunction } from 'express';

export const apiReference = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  };
};
