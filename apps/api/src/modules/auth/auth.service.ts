import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { prisma } from '@segi/database';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(email: string, password: string, organizationId: string) {
    const user = await this.usersService.findByEmail(email, organizationId);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário desativado');
    }

    if (user.blockedUntil && user.blockedUntil > new Date()) {
      throw new UnauthorizedException('Usuário bloqueado temporariamente');
    }

    const isPasswordValid = await this.usersService.verifyPassword(
      user.passwordHash,
      password,
    );

    if (!isPasswordValid) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: { increment: 1 } },
      });

      if (user.failedLoginAttempts >= 4) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            blockedUntil: new Date(Date.now() + 15 * 60 * 1000),
          },
        });
      }

      throw new UnauthorizedException('Email ou senha inválidos');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lastLoginAt: new Date(),
      },
    });

    const accessToken = this.jwtService.sign({
      sub: user.id,
      organizationId: user.organizationId,
      email: user.email,
    });

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        organizationId: user.organizationId,
        type: 'refresh',
      },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        organizationId: user.organizationId,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      const accessToken = this.jwtService.sign({
        sub: payload.sub,
        organizationId: payload.organizationId,
        email: payload.email,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Token de refresh inválido');
    }
  }

  async validateUser(userId: string, organizationId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || user.organizationId !== organizationId) {
      return null;
    }
    return user;
  }
}
