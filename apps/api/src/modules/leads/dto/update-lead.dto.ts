import { IsOptional, IsString, IsPhoneNumber, IsDateString, IsInt, IsEnum } from 'class-validator';

export enum LeadTemperature {
  HOT = 'hot',
  WARM = 'warm',
  COLD = 'cold',
  UNQUALIFIED = 'unqualified',
}

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  preferredName?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  phoneE164?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  courseInterestId?: string;

  @IsOptional()
  @IsString()
  unitInterestId?: string;

  @IsOptional()
  @IsEnum(LeadTemperature)
  leadTemperature?: LeadTemperature;

  @IsOptional()
  @IsInt()
  leadScore?: number;
}
