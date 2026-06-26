import { Request, Response } from 'express';
import { User } from '../../models/authorization/user';

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, is_active, avatar } = req.body;
      const user_interface: User = await User.create({ username, email, password, is_active, avatar });
      const token = user_interface.generateToken();
      const { password: _password, ...safeUser } = user_interface.toJSON();
      res.status(201).json({ user: safeUser, token });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user: User | null = await User.findOne(
        { 
          where: {
            email,
            is_active: "ACTIVE"
          }
      });
      if (!user || !(await user.checkPassword(password))) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }
      const token = user.generateToken();
      const { password: _password, ...safeUser } = user.toJSON();
      res.status(200).json({ user: safeUser, token });
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

}