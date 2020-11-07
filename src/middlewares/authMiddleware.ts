import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface Tokenpayload {
  id: string;
  iat: number;
  exp: number;
}

export default function authMiddleware(
  req: Request, res: Response, next: NextFunction,
) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.sendStatus(401);
  }

  const token = authorization.replace('Bearer', '').trim();

  // encoded token
  try {
    const data = jwt.verify(token, 'secret');
    
    const{ id } = data as Tokenpayload;

    req.userId = id;

    return next();

  } catch {
    res.sendStatus(401);
  }
}