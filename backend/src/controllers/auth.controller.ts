import { Request, Response } from 'express';
import { AuthService } from '../services/auth/auth.service';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Mock DB logic until Prisma is fully configured
    // const user = await prisma.user.findUnique({ where: { email } });
    // if (!user || !await bcrypt.compare(password, user.hashedPassword)) { ... }
    
    // For now, mock a successful login
    const mockUser = {
      id: 'mock-uuid-1234',
      email: email,
      name: 'Test User'
    };

    const token = AuthService.generateToken(mockUser);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: mockUser
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // const existingUser = await prisma.user.findUnique({ where: { email } });
    // if (existingUser) return res.status(400).json({ error: 'Email already exists' });
    
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const newUser = await prisma.user.create({ ... });

    const mockUser = {
      id: 'mock-uuid-5678',
      email,
      name: name || 'New User'
    };

    const token = AuthService.generateToken(mockUser);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: mockUser
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
