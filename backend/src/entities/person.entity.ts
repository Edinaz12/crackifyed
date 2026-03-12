import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { DateRating } from './date-rating.entity';
import { PersonImage } from './person-image.entity';

@Entity('person')
@Index(['name'])
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 50 })
  gender: 'male' | 'female' | 'other';

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => PersonImage, (image) => image.person, {
    eager: true,
    cascade: true,
  })
  images: PersonImage[];

  @OneToMany(() => DateRating, (rating) => rating.person, {
    cascade: true,
  })
  ratings: DateRating[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Computed properties (not persisted)
  get averageRating(): number {
    if (!this.ratings || this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, r) => acc + r.overallRating, 0);
    return Math.round((sum / this.ratings.length) * 10) / 10;
  }

  get totalRatings(): number {
    return this.ratings?.length || 0;
  }
}
