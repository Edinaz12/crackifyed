import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Crackifyed API v1 - Dating Rating Backend';
  }

  getHealth(): { status: string; timestamp: string; version: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
