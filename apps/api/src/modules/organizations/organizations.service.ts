import { Injectable } from '@nestjs/common';
import { prisma } from '@segi/database';

@Injectable()
export class OrganizationsService {
  async getOrganization(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: { units: true },
    });
  }

  async getOrganizationBySlug(slug: string) {
    return prisma.organization.findUnique({
      where: { slug },
      include: { units: true },
    });
  }

  async listUnits(organizationId: string) {
    return prisma.unit.findMany({
      where: { organizationId },
      orderBy: { code: 'asc' },
    });
  }
}
