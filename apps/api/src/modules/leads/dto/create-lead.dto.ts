import { IsEmail, IsOptional, IsString, IsPhoneNumber, IsDateString } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  preferredName?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  phoneE164?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  secondaryPhone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  courseInterestId?: string;

  @IsOptional()
  @IsString()
  unitInterestId?: string;

  @IsString()
  sourceId: string;

  @IsOptional()
  @IsString()
  sourceDetail?: string;

  @IsOptional()
  @IsString()
  channel?: string;

  @IsOptional()
  @IsString()
  campaignId?: string;

  @IsOptional()
  @IsString()
  campaignName?: string;
}
