import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obter organização por ID' })
  async getOrganization(@Param('id') id: string) {
    return this.organizationsService.getOrganization(id);
  }

  @Get(':id/units')
  @ApiOperation({ summary: 'Listar unidades de uma organização' })
  async listUnits(@Param('id') organizationId: string) {
    return this.organizationsService.listUnits(organizationId);
  }
}
