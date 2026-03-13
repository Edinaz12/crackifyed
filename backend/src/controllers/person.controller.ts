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
import { PersonService } from '../services/person.service';
import { CreatePersonDto, UpdatePersonDto, PersonResponseDto, PersonDetailResponseDto } from '../dtos/person.dto';
import { Person } from '../entities/person.entity';

@Controller('api/v1/persons')
export class PersonController {
  constructor(private personService: PersonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPersonDto: CreatePersonDto): Promise<PersonResponseDto> {
    const person = await this.personService.create(createPersonDto);
    return this.mapPersonToDto(person);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ): Promise<{ data: PersonResponseDto[]; total: number; page: number; limit: number }> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      throw new BadRequestException('Invalid page or limit parameters');
    }

    const result = await this.personService.findAll(pageNum, limitNum, search);
    return {
      ...result,
      data: result.data.map((person) => this.mapPersonToDto(person)),
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PersonDetailResponseDto> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new BadRequestException('Invalid person ID');
    }

    const person = await this.personService.findById(idNum);
    return this.mapPersonToDetailDto(person);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<PersonResponseDto> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new BadRequestException('Invalid person ID');
    }

    const person = await this.personService.update(idNum, updatePersonDto);
    return this.mapPersonToDto(person);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new BadRequestException('Invalid person ID');
    }

    await this.personService.delete(idNum);
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string): Promise<any> {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new BadRequestException('Invalid person ID');
    }

    return this.personService.getPersonStats(idNum);
  }

  private mapPersonToDto(person: Person): PersonResponseDto {
    return {
      id: person.id,
      name: person.name,
      age: person.age,
      gender: person.gender,
      description: person.description,
      images: (person.images || []).map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
      })),
      averageRating: person.averageRating,
      totalRatings: person.totalRatings,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    };
  }

  private mapPersonToDetailDto(person: Person): PersonDetailResponseDto {
    return {
      ...this.mapPersonToDto(person),
      ratings: (person.ratings || []).map((rating) => ({
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
      })),
    };
  }
}
