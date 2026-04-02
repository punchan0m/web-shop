import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsUUID('4')
  productId?: string;

  @IsOptional()
  @IsUUID('4')
  categoryId?: string;
}
