import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: 'Obter permissões do usuário' })
  async getPermissions(@Param('id') id: string) {
    return this.usersService.getPermissions(id);
  }
}
