import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateRatingService } from '../services/date-rating.service';
import { DateRatingController } from '../controllers/date-rating.controller';
import { MapController } from '../controllers/map.controller';
import { DateRating } from '../entities/date-rating.entity';
import { Person } from '../entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DateRating, Person])],
  controllers: [DateRatingController, MapController],
  providers: [DateRatingService],
  exports: [DateRatingService],
})
export class DateRatingModule {}
