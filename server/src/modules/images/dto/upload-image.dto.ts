import { IsOptional, IsUUID } from 'class-validator';

export class UploadImageDto {
  @IsOptional()
  @IsUUID('4')
  productId?: string;

  @IsOptional()
  @IsUUID('4')
  categoryId?: string;
}
