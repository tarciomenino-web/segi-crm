import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export enum OpportunityTemperature {
  HOT = 'hot',
  WARM = 'warm',
  COLD = 'cold',
}

export class CreateOpportunityDto {
  @IsString()
  leadId: string;

  @IsString()
  pipelineId: string;

  @IsString()
  stageId: string;

  @IsString()
  unitId: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  sdrId?: string;

  @IsOptional()
  @IsString()
  closerId?: string;

  @IsOptional()
  @IsNumber()
  estimatedValue?: number;

  @IsOptional()
  @IsNumber()
  probability?: number;

  @IsOptional()
  @IsEnum(OpportunityTemperature)
  temperature?: OpportunityTemperature;

  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string;
}
