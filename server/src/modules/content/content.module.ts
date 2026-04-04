import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentSettings } from './entities/content.entity';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContentSettings])],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
