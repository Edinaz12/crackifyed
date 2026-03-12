import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { PersonModule } from './modules/person.module';
import { DateRatingModule } from './modules/date-rating.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    PersonModule,
    DateRatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
