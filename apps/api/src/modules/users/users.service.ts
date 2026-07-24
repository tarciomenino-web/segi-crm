import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@segi/database';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        organizationId: true,
        preferredUnitId: true,
        isActive: true,
        userRoles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                rolePermissions: {
                  select: {
                    permission: {
                      select: {
                        action: true,
                        subject: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByEmail(email: string, organizationId: string) {
    return prisma.user.findUnique({
      where: {
        organizationId_email: {
          organizationId,
          email,
        },
      },
    });
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password);
    } catch (error) {
      throw new BadRequestException('Erro ao processar senha');
    }
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      return false;
    }
  }

  async getPermissions(userId: string) {
    const user = await this.findById(userId);
    if (!user) return [];

    const permissions: Array<{ action: string; subject: string }> = [];
    user.userRoles.forEach((ur) => {
      ur.role.rolePermissions.forEach((rp) => {
        permissions.push({
          action: rp.permission.action,
          subject: rp.permission.subject,
        });
      });
    });

    return permissions;
  }
}
