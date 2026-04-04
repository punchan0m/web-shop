import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import type { ContentImage } from '../entities/content.entity';

export class UpdateHomeContentDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  siteName?: string;

  @IsString()
  @MaxLength(30)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsArray()
  images?: ContentImage[];
}
