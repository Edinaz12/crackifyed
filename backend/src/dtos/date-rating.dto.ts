import {
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsDate,
  IsString,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDateRatingDto {
  @IsNumber()
  @Min(1)
  @Max(10)
  overallRating: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  kindnessRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  conversationRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  humorRating?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsDate()
  @Type(() => Date)
  dateOfDate: Date;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsObject()
  @Type(() => Object)
  locationCoordinates: { x: number; y: number };

  @IsOptional()
  @IsString()
  instagramHandle?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  snapchatHandle?: string;
}

export class UpdateDateRatingDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  overallRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  kindnessRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  conversationRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  humorRating?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfDate?: Date;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsObject()
  @Type(() => Object)
  locationCoordinates?: { x: number; y: number };
}

export class DateRatingResponseDto {
  id: number;
  personId: number;
  overallRating: number;
  kindnessRating?: number;
  conversationRating?: number;
  humorRating?: number;
  comment?: string;
  dateOfDate: Date;
  locationName?: string;
  locationCoordinates: { x: number; y: number };
  createdAt: Date;
}

export class MapRatingResponseDto extends DateRatingResponseDto {
  person: {
    id: number;
    name: string;
    age: number;
    averageRating: number;
    totalRatings: number;
  };
}
