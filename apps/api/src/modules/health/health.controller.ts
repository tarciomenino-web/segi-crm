import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check geral' })
  getHealth() {
    return this.healthService.getHealth();
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe (Kubernetes)' })
  getLiveness() {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe (Kubernetes)' })
  getReadiness() {
    return this.healthService.getReadiness();
  }
}
