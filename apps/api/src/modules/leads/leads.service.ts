import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma } from '@segi/database';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { normalizePhone } from '@/common/utils/phone.utils';

@Injectable()
export class LeadsService {
  async create(organizationId: string, unitId: string, dto: CreateLeadDto) {
    // Normalizar telefone se fornecido
    let phoneE164 = null;
    if (dto.phoneE164) {
      phoneE164 = normalizePhone(dto.phoneE164);
    }

    // Verificar duplicidade por email ou telefone
    if (phoneE164) {
      const existingByPhone = await prisma.lead.findFirst({
        where: {
          organizationId,
          phoneE164,
          deletedAt: null,
        },
      });

      if (existingByPhone) {
        throw new BadRequestException('Lead com este telefone já existe');
      }
    }

    if (dto.email) {
      const existingByEmail = await prisma.lead.findFirst({
        where: {
          organizationId,
          email: dto.email,
          deletedAt: null,
        },
      });

      if (existingByEmail) {
        throw new BadRequestException('Lead com este e-mail já existe');
      }
    }

    // Criar lead
    return prisma.lead.create({
      data: {
        organizationId,
        unitId,
        fullName: dto.fullName,
        preferredName: dto.preferredName,
        phoneE164,
        phoneRaw: dto.phoneE164,
        email: dto.email,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        city: dto.city,
        courseInterestId: dto.courseInterestId,
        unitInterestId: dto.unitInterestId,
        sourceId: dto.sourceId,
        sourceDetail: dto.sourceDetail,
        channel: dto.channel,
        campaignId: dto.campaignId,
        campaignName: dto.campaignName,
        firstTouchAt: new Date(),
        lastTouchAt: new Date(),
        leadScore: 0,
        leadTemperature: 'cold',
      },
    });
  }

  async findById(organizationId: string, id: string) {
    const lead = await prisma.lead.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      include: {
        opportunities: true,
        source: true,
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado');
    }

    return lead;
  }

  async list(organizationId: string, unitId?: string, limit: number = 50, offset: number = 0) {
    const where: any = {
      organizationId,
      deletedAt: null,
    };

    if (unitId) {
      where.unitId = unitId;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.lead.count({ where }),
    ]);

    return {
      data: leads,
      total,
      limit,
      offset,
    };
  }

  async update(organizationId: string, id: string, dto: UpdateLeadDto) {
    // Verificar se lead existe
    await this.findById(organizationId, id);

    // Normalizar telefone se fornecido
    let phoneE164 = undefined;
    if (dto.phoneE164) {
      phoneE164 = normalizePhone(dto.phoneE164);

      // Verificar duplicidade
      const existing = await prisma.lead.findFirst({
        where: {
          organizationId,
          phoneE164,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (existing) {
        throw new BadRequestException('Lead com este telefone já existe');
      }
    }

    return prisma.lead.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        preferredName: dto.preferredName,
        phoneE164,
        email: dto.email,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        city: dto.city,
        courseInterestId: dto.courseInterestId,
        unitInterestId: dto.unitInterestId,
        leadTemperature: dto.leadTemperature,
        leadScore: dto.leadScore,
        lastTouchAt: new Date(),
      },
    });
  }

  async calculateScore(leadId: string): Promise<number> {
    let score = 0;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { opportunities: true },
    });

    if (!lead) return 0;

    // Scoring rules (podem ser configuráveis depois)
    if (lead.courseInterestId) score += 10;
    if (lead.unitInterestId) score += 10;
    if (lead.phoneE164) score += 5;
    if (lead.email) score += 5;

    // Se tem oportunidade
    if (lead.opportunities.length > 0) {
      score += 20;
    }

    // Se respondeu recentemente
    const lastTouchDays =
      (Date.now() - new Date(lead.lastTouchAt).getTime()) / (1000 * 60 * 60 * 24);
    if (lastTouchDays < 1) score += 15;
    if (lastTouchDays < 3) score += 10;

    return Math.min(score, 100); // Max 100
  }

  async findDuplicates(organizationId: string, leadId: string) {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado');
    }

    const duplicates = [];

    // Buscar por telefone
    if (lead.phoneE164) {
      const byPhone = await prisma.lead.findMany({
        where: {
          organizationId,
          phoneE164: lead.phoneE164,
          id: { not: leadId },
          deletedAt: null,
        },
      });
      duplicates.push(...byPhone);
    }

    // Buscar por email
    if (lead.email) {
      const byEmail = await prisma.lead.findMany({
        where: {
          organizationId,
          email: lead.email,
          id: { not: leadId },
          deletedAt: null,
        },
      });
      duplicates.push(...byEmail);
    }

    // Remover duplicatas da array
    return Array.from(new Map(duplicates.map((d) => [d.id, d])).values());
  }

  async mergeDuplicates(organizationId: string, mainLeadId: string, duplicateLeadId: string) {
    const mainLead = await this.findById(organizationId, mainLeadId);
    const duplicateLead = await this.findById(organizationId, duplicateLeadId);

    // Transferir oportunidades
    await prisma.opportunity.updateMany({
      where: { leadId: duplicateLeadId },
      data: { leadId: mainLeadId },
    });

    // Transferir conversas
    await prisma.conversation.updateMany({
      where: { leadId: duplicateLeadId },
      data: { leadId: mainLeadId },
    });

    // Marcar duplicate como deletado (soft delete)
    await prisma.lead.update({
      where: { id: duplicateLeadId },
      data: { deletedAt: new Date() },
    });

    return mainLead;
  }
}
