import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo lead' })
  async create(
    @Body() dto: CreateLeadDto,
    @Body('organizationId') organizationId: string,
    @Body('unitId') unitId: string,
  ) {
    return this.leadsService.create(organizationId, unitId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar leads da organização' })
  async list(
    @Query('organizationId') organizationId: string,
    @Query('unitId') unitId?: string,
    @Query('limit') limit: string = '50',
    @Query('offset') offset: string = '0',
  ) {
    return this.leadsService.list(
      organizationId,
      unitId,
      parseInt(limit),
      parseInt(offset),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter lead por ID' })
  async findById(
    @Param('id') id: string,
    @Body('organizationId') organizationId: string,
  ) {
    return this.leadsService.findById(organizationId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar lead' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
    @Body('organizationId') organizationId: string,
  ) {
    return this.leadsService.update(organizationId, id, dto);
  }

  @Get(':id/duplicates')
  @ApiOperation({ summary: 'Encontrar duplicatas de um lead' })
  async findDuplicates(
    @Param('id') id: string,
    @Body('organizationId') organizationId: string,
  ) {
    return this.leadsService.findDuplicates(organizationId, id);
  }

  @Post(':id/merge/:duplicateId')
  @ApiOperation({ summary: 'Mesclar leads duplicados' })
  async mergeDuplicates(
    @Param('id') mainLeadId: string,
    @Param('duplicateId') duplicateLeadId: string,
    @Body('organizationId') organizationId: string,
  ) {
    return this.leadsService.mergeDuplicates(
      organizationId,
      mainLeadId,
      duplicateLeadId,
    );
  }

  @Post(':id/score')
  @ApiOperation({ summary: 'Calcular score do lead' })
  async calculateScore(@Param('id') id: string) {
    const score = await this.leadsService.calculateScore(id);
    return { leadId: id, score };
  }
}
