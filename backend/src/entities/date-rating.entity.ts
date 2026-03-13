import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Person } from './person.entity';

@Entity('date_rating')
@Index(['personId'])
@Index(['dateOfDate'])
@Index(['locationCoordinates'], { spatial: true })
export class DateRating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Person, (person) => person.ratings, { onDelete: 'CASCADE' })
  person: Person;

  @Column({ type: 'integer' })
  personId: number;

  @Column({ type: 'integer' })
  overallRating: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  kindnessRating: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  conversationRating: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  humorRating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'date' })
  dateOfDate: Date;

  @Column({ type: 'varchar', length: 512, nullable: true })
  locationName: string;

  @Column({
    type: 'point',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  locationCoordinates: { x: number; y: number };

  // Premium Contact Information (optional, visible to authenticated users only)
  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  instagramHandle: string;

  @Column({ type: 'varchar', length: 20, nullable: true, select: false })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  snapchatHandle: string;

  @CreateDateColumn()
  createdAt: Date;
}
