import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';

class AuthController {
  async authenticate(req: Request, res: Response) {
    const repository = getRepository(User);
    const { email, password } = req.body;
    
    const user = await repository.findOne({ 
      where: { 
        email
       } 
    });

    // if not is email correct return error 401 incorret email
    if (!user) {
      return res.sendStatus(401);
    }

    // compare password database with password insert for user
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.sendStatus(401);
    }

    // JWT validation
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });

    // remove password in response
    delete user.password;

    return res.json({
      user,
      token,
    });
    
  } 
}

export default new AuthController();