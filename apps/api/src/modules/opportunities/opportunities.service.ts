import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@segi/database';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';

@Injectable()
export class OpportunitiesService {
  async create(organizationId: string, dto: CreateOpportunityDto) {
    return prisma.opportunity.create({
      data: {
        organizationId,
        leadId: dto.leadId,
        pipelineId: dto.pipelineId,
        stageId: dto.stageId,
        unitId: dto.unitId,
        courseId: dto.courseId,
        sdrId: dto.sdrId,
        closerId: dto.closerId,
        estimatedValue: dto.estimatedValue,
        probability: dto.probability || 0,
        temperature: dto.temperature || 'cold',
        expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : null,
      },
      include: { lead: true, stage: true },
    });
  }

  async findById(organizationId: string, id: string) {
    const opp = await prisma.opportunity.findFirst({
      where: { id, organizationId },
      include: {
        lead: true,
        stage: true,
        pipeline: { include: { stages: true } },
        stageHistory: { orderBy: { movedAt: 'desc' } }
      },
    });

    if (!opp) {
      throw new NotFoundException('Oportunidade não encontrada');
    }

    return opp;
  }

  async listByStage(organizationId: string, stageId: string) {
    return prisma.opportunity.findMany({
      where: { organizationId, stageId },
      include: { lead: true, stage: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async moveToStage(organizationId: string, id: string, stageId: string, movedById: string) {
    const opp = await this.findById(organizationId, id);

    await prisma.opportunityStageHistory.create({
      data: {
        opportunityId: id,
        fromStageId: opp.stageId,
        toStageId: stageId,
        movedBy: movedById,
        movedAt: new Date(),
      },
    });

    return prisma.opportunity.update({
      where: { id },
      data: { stageId },
      include: { lead: true, stage: true },
    });
  }
}
