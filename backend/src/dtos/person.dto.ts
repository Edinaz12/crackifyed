import { IsString, IsNumber, IsOptional, Min, Max, IsEnum } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(18)
  @Max(120)
  age: number;

  @IsEnum(['male', 'female', 'other'])
  gender: 'male' | 'female' | 'other';

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePersonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  @IsOptional()
  @IsString()
  description?: string;
}

export class PersonResponseDto {
  id: number;
  name: string;
  age: number;
  gender: string;
  description?: string;
  images: Array<{ id: number; imageUrl: string }>;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PersonDetailResponseDto extends PersonResponseDto {
  ratings: any[];
}
