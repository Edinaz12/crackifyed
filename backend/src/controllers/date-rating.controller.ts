import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { DateRatingService } from '../services/date-rating.service';
import { CreateDateRatingDto, UpdateDateRatingDto, DateRatingResponseDto } from '../dtos/date-rating.dto';
import { DateRating } from '../entities/date-rating.entity';

@Controller('api/v1/ratings')
export class DateRatingController {
  constructor(private dateRatingService: DateRatingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Query('personId') personId: string,
    @Body() createDateRatingDto: CreateDateRatingDto,
  ): Promise<DateRatingResponseDto> {
    const personIdNum = parseInt(personId, 10);
    if (isNaN(personIdNum)) {
      throw new BadRequestException('Invalid personId parameter');
    }

    const rating = await this.dateRatingService.create(personIdNum, createDateRatingDto);
    return this.mapToDto(rating);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<{ data: DateRatingResponseDto[]; total: number; page: number; limit: number }> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      throw new BadRequestException('Invalid page or limit parameters');
    }

    const result = await this.dateRatingService.findAll(pageNum, limitNum);
    return {
      ...result,
      data: result.data.map((rating) => this.mapToDto(rating)),
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<DateRatingResponseDto> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new BadRequestException('Invalid rating ID');
    }

    const rating = await this.dateRatingService.findById(idNum);
    return this.mapToDto(rating);
  }

  @Get('person/:personId')
  async findByPersonId(
    @Param('personId') personId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<{ data: DateRatingResponseDto[]; total: number }> {
    const personIdNum = parseInt(personId, 10);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(personIdNum) || isNaN(pageNum) || isNaN(limitNum)) {
      throw new BadRequestException('Invalid parameters');
    }

    const result = await this.dateRatingService.findByPersonId(personIdNum, pageNum, limitNum);
    return {
      ...result,
      data: result.data.map((rating) => this.mapToDto(rating)),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDateRatingDto: UpdateDateRatingDto,
  ): Promise<DateRatingResponseDto> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new BadRequestException('Invalid rating ID');
    }

    const rating = await this.dateRatingService.update(idNum, updateDateRatingDto);
    return this.mapToDto(rating);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new BadRequestException('Invalid rating ID');
    }

    await this.dateRatingService.delete(idNum);
  }

  private mapToDto(rating: DateRating): DateRatingResponseDto {
    return {
      id: rating.id,
      personId: rating.personId,
      overallRating: rating.overallRating,
      kindnessRating: rating.kindnessRating,
      conversationRating: rating.conversationRating,
      humorRating: rating.humorRating,
      comment: rating.comment,
      dateOfDate: rating.dateOfDate,
      locationName: rating.locationName,
      locationCoordinates: rating.locationCoordinates,
      createdAt: rating.createdAt,
    };
  }
}
