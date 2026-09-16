import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { NotesModule } from '../notes/notes.module.js';

@Module({
  imports: [
    NotesModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
