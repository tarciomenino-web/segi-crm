import { Injectable } from '@nestjs/common';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  database?: boolean;
  redis?: boolean;
  uptime?: number;
}

@Injectable()
export class HealthService {
  private startTime = Date.now();

  getHealth(): HealthStatus {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  getLiveness(): { status: 'alive' } {
    return { status: 'alive' };
  }

  getReadiness(): HealthStatus {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: true,
      redis: true,
    };
  }
}
