import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonService } from '../services/person.service';
import { PersonController } from '../controllers/person.controller';
import { Person } from '../entities/person.entity';
import { PersonImage } from '../entities/person-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, PersonImage])],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
