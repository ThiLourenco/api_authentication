import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

class UserController {
  index(req: Request, res: Response) {
    return res.send({
      userID: req.userId
    });
  }

  async store(req: Request, res: Response) {
    const repository = getRepository(User);
    const { email, password } = req.body;
    
    const userExists = await repository.findOne({ 
      where: { 
        email
       } 
    });

    // if email exists error 409 conflict
    if (userExists) {
      return res.sendStatus(409);
    }

    // create entity in node
    const user = repository.create({ email, password });

    // save in datebase
    await repository.save(user);

    return res.json(user);

  } 
}

export default new UserController();