import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum NoteStatus {
  PENDING = 'PENDIENTE',
  IN_PROGRESS = 'EN_CURSO',
  DONE = 'HECHO',
}

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  text: string;

  @Column({
    type: 'enum',
    enum: NoteStatus,
    default: NoteStatus.PENDING,
  })
  status: NoteStatus;

  @Column({
    type: 'float',
    default: 50,
  })
  positionX: number;

  @Column({
    type: 'float',
    default: 50,
  })
  positionY: number;
}
