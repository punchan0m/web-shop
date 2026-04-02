import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from './entities/images.entity';
import { Products } from '../products/entities/products.entity';
import { ProductsCategories } from '../products-categories/entities/products-categories.entity';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Images, Products, ProductsCategories])],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
