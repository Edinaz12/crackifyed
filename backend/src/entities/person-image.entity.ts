import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Person } from './person.entity';

@Entity('person_image')
export class PersonImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Person, (person) => person.images, { onDelete: 'CASCADE' })
  person: Person;

  @Column({ type: 'int' })
  personId: number;

  @Column({ type: 'varchar', length: 1024 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagePath: string;

  @CreateDateColumn()
  createdAt: Date;
}
