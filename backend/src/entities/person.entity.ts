import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

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

  @OneToMany('PersonImage', 'person', {
    eager: true,
    cascade: true,
  })
  images: any[];

  @OneToMany('DateRating', 'person', {
    cascade: true,
  })
  ratings: any[];

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
