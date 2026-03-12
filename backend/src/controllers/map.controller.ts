import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { DateRatingService } from '../services/date-rating.service';

@Controller('api/v1/map')
export class MapController {
  constructor(private dateRatingService: DateRatingService) {}

  /**
   * Get all ratings as GeoJSON for map display
   */
  @Get('ratings')
  async getRatingsAsGeoJSON(
    @Query('minLat') minLat?: string,
    @Query('minLng') minLng?: string,
    @Query('maxLat') maxLat?: string,
    @Query('maxLng') maxLng?: string,
  ): Promise<any> {
    let bounds = null;

    if (minLat && minLng && maxLat && maxLng) {
      const minLatNum = parseFloat(minLat);
      const minLngNum = parseFloat(minLng);
      const maxLatNum = parseFloat(maxLat);
      const maxLngNum = parseFloat(maxLng);

      if (isNaN(minLatNum) || isNaN(minLngNum) || isNaN(maxLatNum) || isNaN(maxLngNum)) {
        throw new BadRequestException('Invalid bounding box coordinates');
      }

      bounds = { minLat: minLatNum, minLng: minLngNum, maxLat: maxLatNum, maxLng: maxLngNum };
    }

    return this.dateRatingService.getGeoJSON(bounds?.minLat, bounds?.minLng, bounds?.maxLat, bounds?.maxLng);
  }

  /**
   * Get ratings within a bounding box (with pagination)
   */
  @Get('bounds')
  async getByBounds(
    @Query('minLat') minLat: string,
    @Query('minLng') minLng: string,
    @Query('maxLat') maxLat: string,
    @Query('maxLng') maxLng: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
  ): Promise<{ data: any[]; total: number }> {
    const minLatNum = parseFloat(minLat);
    const minLngNum = parseFloat(minLng);
    const maxLatNum = parseFloat(maxLat);
    const maxLngNum = parseFloat(maxLng);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (
      isNaN(minLatNum) ||
      isNaN(minLngNum) ||
      isNaN(maxLatNum) ||
      isNaN(maxLngNum) ||
      isNaN(pageNum) ||
      isNaN(limitNum)
    ) {
      throw new BadRequestException('Invalid parameters');
    }

    const result = await this.dateRatingService.findByBounds(minLatNum, minLngNum, maxLatNum, maxLngNum, pageNum, limitNum);

    return {
      data: result.data.map((rating) => ({
        id: rating.id,
        personId: rating.personId,
        personName: rating.person.name,
        overallRating: rating.overallRating,
        locationName: rating.locationName,
        locationCoordinates: rating.locationCoordinates,
        dateOfDate: rating.dateOfDate,
        createdAt: rating.createdAt,
      })),
      total: result.total,
    };
  }

  /**
   * Get ratings near a specific point
   */
  @Get('nearby')
  async getNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string = '5000',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
  ): Promise<{ data: any[]; total: number }> {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusNum = parseInt(radius, 10);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (
      isNaN(latNum) ||
      isNaN(lngNum) ||
      isNaN(radiusNum) ||
      isNaN(pageNum) ||
      isNaN(limitNum)
    ) {
      throw new BadRequestException('Invalid parameters');
    }

    const result = await this.dateRatingService.findNearby(latNum, lngNum, radiusNum, pageNum, limitNum);

    return {
      data: result.data.map((rating) => ({
        id: rating.id,
        personId: rating.personId,
        personName: rating.person.name,
        overallRating: rating.overallRating,
        locationName: rating.locationName,
        locationCoordinates: rating.locationCoordinates,
        dateOfDate: rating.dateOfDate,
        distance: this.calculateDistance(latNum, lngNum, rating.locationCoordinates.y, rating.locationCoordinates.x),
        createdAt: rating.createdAt,
      })),
      total: result.total,
    };
  }

  /**
   * Simple distance calculation (Haversine formula)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}
