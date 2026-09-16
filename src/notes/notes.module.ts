import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller.js';
import { NotesService } from './notes.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
