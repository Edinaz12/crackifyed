import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateRating } from '../entities/date-rating.entity';
import { Person } from '../entities/person.entity';
import { CreateDateRatingDto, UpdateDateRatingDto } from '../dtos/date-rating.dto';

@Injectable()
export class DateRatingService {
  constructor(
    @InjectRepository(DateRating)
    private dateRatingRepository: Repository<DateRating>,
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  async create(personId: number, createDateRatingDto: CreateDateRatingDto): Promise<DateRating> {
    // Verify person exists
    const person = await this.personRepository.findOne({ where: { id: personId } });
    if (!person) {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    // Validate coordinates
    if (
      !createDateRatingDto.locationCoordinates ||
      typeof createDateRatingDto.locationCoordinates.x !== 'number' ||
      typeof createDateRatingDto.locationCoordinates.y !== 'number'
    ) {
      throw new BadRequestException('Invalid location coordinates');
    }

    const dateRating = this.dateRatingRepository.create({
      ...createDateRatingDto,
      personId,
      person,
    });

    return this.dateRatingRepository.save(dateRating);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: DateRating[]; total: number; page: number; limit: number }> {
    const query = this.dateRatingRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.person', 'person')
      .leftJoinAndSelect('person.images', 'images')
      .orderBy('rating.createdAt', 'DESC');

    const total = await query.getCount();
    const skip = (page - 1) * limit;
    const data = await query.skip(skip).take(limit).getMany();

    return { data, total, page, limit };
  }

  async findById(id: number): Promise<DateRating> {
    const dateRating = await this.dateRatingRepository.findOne({
      where: { id },
      relations: ['person'],
    });

    if (!dateRating) {
      throw new NotFoundException(`Dating rating with ID ${id} not found`);
    }

    return dateRating;
  }

  async findByPersonId(
    personId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: DateRating[]; total: number }> {
    const query = this.dateRatingRepository
      .createQueryBuilder('rating')
      .where('rating.personId = :personId', { personId })
      .leftJoinAndSelect('rating.person', 'person')
      .orderBy('rating.dateOfDate', 'DESC');

    const total = await query.getCount();
    const skip = (page - 1) * limit;
    const data = await query.skip(skip).take(limit).getMany();

    return { data, total };
  }

  async update(id: number, updateDateRatingDto: UpdateDateRatingDto): Promise<DateRating> {
    const dateRating = await this.findById(id);

    Object.assign(dateRating, updateDateRatingDto);
    return this.dateRatingRepository.save(dateRating);
  }

  async delete(id: number): Promise<void> {
    const dateRating = await this.findById(id);
    await this.dateRatingRepository.remove(dateRating);
  }

  /**
   * Find all ratings within a geographic bounding box
   * Useful for map features
   */
  async findByBounds(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    page: number = 1,
    limit: number = 100,
  ): Promise<{ data: DateRating[]; total: number }> {
    const query = this.dateRatingRepository
      .createQueryBuilder('rating')
      .where(
        `ST_DWithin(
          rating.locationCoordinates::geography,
          ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326)::geography,
          0
        )`,
        {
          minLat,
          minLng,
          maxLat,
          maxLng,
        },
      )
      .leftJoinAndSelect('rating.person', 'person')
      .leftJoinAndSelect('person.images', 'images')
      .orderBy('rating.dateOfDate', 'DESC');

    const total = await query.getCount();
    const skip = (page - 1) * limit;
    const data = await query.skip(skip).take(limit).getMany();

    return { data, total };
  }

  /**
   * Find ratings near a specific point (radius in meters)
   */
  async findNearby(
    latitude: number,
    longitude: number,
    radiusMeters: number = 5000,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ data: DateRating[]; total: number }> {
    const query = this.dateRatingRepository
      .createQueryBuilder('rating')
      .where(
        `ST_DWithin(
          rating.locationCoordinates::geography,
          ST_Point(:longitude, :latitude)::geography,
          :radius
        )`,
        {
          latitude,
          longitude,
          radius: radiusMeters,
        },
      )
      .leftJoinAndSelect('rating.person', 'person')
      .leftJoinAndSelect('person.images', 'images')
      .orderBy(
        `ST_Distance(
          rating.locationCoordinates::geography,
          ST_Point(:longitude, :latitude)::geography
        )`,
        'ASC',
      );

    const total = await query.getCount();
    const skip = (page - 1) * limit;
    const data = await query.skip(skip).take(limit).getMany();

    return { data, total };
  }

  /**
   * Get GeoJSON representation of all ratings for map display
   */
  async getGeoJSON(
    minLat?: number,
    minLng?: number,
    maxLat?: number,
    maxLng?: number,
  ): Promise<any> {
    let query = this.dateRatingRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.person', 'person')
      .leftJoinAndSelect('person.images', 'images');

    if (minLat && minLng && maxLat && maxLng) {
      query = query.where(
        `ST_DWithin(
          rating.locationCoordinates::geography,
          ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326)::geography,
          0
        )`,
        {
          minLat,
          minLng,
          maxLat,
          maxLng,
        },
      );
    }

    const ratings = await query.orderBy('rating.dateOfDate', 'DESC').getMany();

    const features = ratings.map((rating) => ({
      type: 'Feature',
      properties: {
        id: rating.id,
        personId: rating.personId,
        personName: rating.person.name,
        overallRating: rating.overallRating,
        locationName: rating.locationName,
        dateOfDate: rating.dateOfDate,
        createdAt: rating.createdAt,
      },
      geometry: {
        type: 'Point',
        coordinates: [rating.locationCoordinates.x, rating.locationCoordinates.y],
      },
    }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
