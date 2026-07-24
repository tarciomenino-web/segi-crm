import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class LoginDto {
  email: string;
  password: string;
  organizationId: string;
}

class RefreshDto {
  refreshToken: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Fazer login' })
  async login(@Body() dto: LoginDto) {
    if (!dto.email || !dto.password || !dto.organizationId) {
      throw new BadRequestException('Email, password e organizationId são obrigatórios');
    }

    return this.authService.login(dto.email, dto.password, dto.organizationId);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar token de acesso' })
  async refresh(@Body() dto: RefreshDto) {
    if (!dto.refreshToken) {
      throw new BadRequestException('refreshToken é obrigatório');
    }

    return this.authService.refresh(dto.refreshToken);
  }
}
