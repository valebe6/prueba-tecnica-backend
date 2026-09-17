import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('No se encuentra el usuario');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async create(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<User> {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
      active: true,
    });

    return this.userRepository.save(user);
  }

  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: UserRole;
      password?: string;
    },
  ): Promise<User> {
    const user = await this.findById(id);

    if (data.email !== undefined && data.email !== user.email) {
      const existingUser = await this.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Ya existe un usuario con ese correo');
      }
      user.email = data.email;
    }

    if (data.name !== undefined) {
      user.name = data.name;
    }

    if (data.role !== undefined) {
      if (
        user.role === UserRole.ADMIN &&
        data.role !== UserRole.ADMIN &&
        user.active
      ) {
        const activeAdmins = await this.userRepository.count({
          where: {
            role: UserRole.ADMIN,
            active: true,
          },
        });

        if (activeAdmins <= 1) {
          throw new ConflictException(
            'Debe existir al menos un administrador activo',
          );
        }
      }
      user.role = data.role;
    }

    if (data.password && data.password.trim().length > 0) {
      user.password = await bcrypt.hash(data.password, 10);
    }

    return this.userRepository.save(user);
  }

  async changeStatus(id: string): Promise<User> {
    const user = await this.findById(id);

    if (user.role === UserRole.ADMIN && user.active) {
      const activeAdmins = await this.userRepository.count({
        where: {
          role: UserRole.ADMIN,
          active: true,
        },
      });

      if (activeAdmins <= 1) {
        throw new ConflictException(
          'Debe existir al menos un administrador activo',
        );
      }
    }

    user.active = !user.active;

    return this.userRepository.save(user);
  }
}
