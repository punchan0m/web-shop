import { IsString, MaxLength } from 'class-validator';

export class UpdateLayoutContentDto {
  @IsString()
  @MaxLength(50)
  navbarTitle: string;

  @IsString()
  @MaxLength(120)
  footerLeft: string;

  @IsString()
  @MaxLength(120)
  footerRight: string;
}
