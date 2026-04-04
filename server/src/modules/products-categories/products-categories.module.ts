

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsCategoriesService } from './products-categories.service';
import { ProductsCategoriesController } from './products-categories.controller';
import { ProductsCategories } from './entities/products-categories.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProductsCategories])],
    controllers: [ProductsCategoriesController],
    providers: [
        ProductsCategoriesService, ],
})
export class ProductsCategoriesModule {}
