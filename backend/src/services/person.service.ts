import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../entities/person.entity';
import { PersonImage } from '../entities/person-image.entity';
import { CreatePersonDto, UpdatePersonDto } from '../dtos/person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    @InjectRepository(PersonImage)
    private personImageRepository: Repository<PersonImage>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const person = this.personRepository.create(createPersonDto);
    return this.personRepository.save(person);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    search?: string,
  ): Promise<{ data: Person[]; total: number; page: number; limit: number }> {
    const query = this.personRepository.createQueryBuilder('person');

    if (search) {
      query.where('person.name ILIKE :search', { search: `%${search}%` });
    }

    query.leftJoinAndSelect('person.ratings', 'ratings');
    query.orderBy('person.createdAt', 'DESC');

    const total = await query.getCount();
    const skip = (page - 1) * limit;
    const data = await query.skip(skip).take(limit).getMany();

    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: ['images', 'ratings'],
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.findById(id);

    Object.assign(person, updatePersonDto);
    return this.personRepository.save(person);
  }

  async delete(id: number): Promise<void> {
    const person = await this.findById(id);
    await this.personRepository.remove(person);
  }

  async addImage(personId: number, imageUrl: string, imagePath?: string): Promise<PersonImage> {
    const person = await this.findById(personId);

    const personImage = this.personImageRepository.create({
      person,
      personId,
      imageUrl,
      imagePath,
    });

    return this.personImageRepository.save(personImage);
  }

  async removeImage(imageId: number): Promise<void> {
    const image = await this.personImageRepository.findOne({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    await this.personImageRepository.remove(image);
  }

  async getPersonStats(id: number) {
    const person = await this.findById(id);

    return {
      id: person.id,
      name: person.name,
      age: person.age,
      gender: person.gender,
      averageRating: person.averageRating,
      totalRatings: person.totalRatings,
      imageCount: person.images?.length || 0,
    };
  }
}
