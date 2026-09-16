import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from '../users/entities/user.entity.js';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const count = await this.userRepository.count();

    if (count > 0) {
      return;
    }

    const adminPassword = await bcrypt.hash('Admin123', 10);

    const userPassword = await bcrypt.hash('User123', 10);

    await this.userRepository.save([
      {
        name: 'Administrador',
        email: 'admin@test.com',
        password: adminPassword,
        role: UserRole.ADMIN,
        active: true,
      },

      {
        name: 'Usuario',
        email: 'user@test.com',
        password: userPassword,
        role: UserRole.USER,
        active: true,
      },
    ]);
  }
}
