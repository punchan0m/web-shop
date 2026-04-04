import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class UpdateImageDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  url?: string;

  @ValidateIf((_, value) => value !== undefined && value !== null)
  @IsUUID('4')
  productId?: string | null;

  @ValidateIf((_, value) => value !== undefined && value !== null)
  @IsUUID('4')
  categoryId?: string | null;
}
