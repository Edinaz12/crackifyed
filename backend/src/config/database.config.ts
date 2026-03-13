import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Person } from '../entities/person.entity';
import { PersonImage } from '../entities/person-image.entity';
import { DateRating } from '../entities/date-rating.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'crackifyed_user',
  password: process.env.DB_PASSWORD || 'crackifyed_secure_password',
  database: process.env.DB_NAME || 'crackifyed_db',
  entities: [Person, PersonImage, DateRating],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  dropSchema: false,
  migrationsRun: false,
};
