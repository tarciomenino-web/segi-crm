import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';

@ApiTags('Opportunities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova oportunidade' })
  async create(
    @Body() dto: CreateOpportunityDto,
    @Body('organizationId') organizationId: string,
  ) {
    return this.opportunitiesService.create(organizationId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter oportunidade por ID' })
  async findById(
    @Param('id') id: string,
    @Body('organizationId') organizationId: string,
  ) {
    return this.opportunitiesService.findById(organizationId, id);
  }

  @Get('stage/:stageId')
  @ApiOperation({ summary: 'Listar oportunidades por etapa (Kanban)' })
  async listByStage(
    @Param('stageId') stageId: string,
    @Body('organizationId') organizationId: string,
  ) {
    return this.opportunitiesService.listByStage(organizationId, stageId);
  }

  @Post(':id/move/:stageId')
  @ApiOperation({ summary: 'Mover oportunidade para outra etapa' })
  async moveToStage(
    @Param('id') id: string,
    @Param('stageId') stageId: string,
    @Body('organizationId') organizationId: string,
    @Body('userId') userId: string,
  ) {
    return this.opportunitiesService.moveToStage(organizationId, id, stageId, userId);
  }
}
