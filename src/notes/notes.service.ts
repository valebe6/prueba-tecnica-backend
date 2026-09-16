import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  findAll() {
    return this.noteRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    const note = await this.noteRepository.findOne({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException('Nota no encontrada');
    }

    return note;
  }

  async create(data: Partial<Note>) {
    const note = this.noteRepository.create(data);

    return this.noteRepository.save(note);
  }

  async update(id: string, data: Partial<Note>) {
    const note = await this.findOne(id);

    Object.assign(note, data);

    return this.noteRepository.save(note);
  }

  async remove(id: string) {
    const note = await this.findOne(id);

    await this.noteRepository.remove(note);

    return {
      message: 'Nota eliminada',
    };
  }
}
