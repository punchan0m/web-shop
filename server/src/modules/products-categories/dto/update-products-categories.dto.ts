import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProductsCategoriesDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}