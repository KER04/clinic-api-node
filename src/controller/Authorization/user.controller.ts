import { Request, Response } from 'express';
import { UserI, User } from '../../models/authorization/user'; 

export class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
      const offset = (page - 1) * limit;

      const { count, rows } = await User.findAndCountAll({
        attributes: { exclude: ["password"] },
        limit,
        offset,
      });

      res.status(200).json({
        data: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  }


  public async createUser(req: Request, res: Response) {
    const { username, email, password, status, avatar } = req.body;

    try {
      const body: UserI = {
        username,
        email,
        password,
        is_active: status ?? "ACTIVE",
        avatar,
      };

      const newUser = await User.create({ ...body });
      const created = await User.findByPk(newUser.id, {
        attributes: { exclude: ["password"] },
      });

      res.status(201).json({ user: created });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

}

