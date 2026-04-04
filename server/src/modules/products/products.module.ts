import { Products } from './entities/products.entity';
import { ProductsCategories } from '../products-categories/entities/products-categories.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Products, ProductsCategories])],
    controllers: [
        ProductsController
    ],
    providers: [
        ProductsService, ],
})
export class ProductsModule {}
