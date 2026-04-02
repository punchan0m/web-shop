import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Products } from './entities/products.entity';
import { ProductsCategories } from '../products-categories/entities/products-categories.entity';
import { Images } from '../images/entities/images.entity';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productRepo: Repository<Products>,

    @InjectRepository(ProductsCategories)
    private categoryRepo: Repository<ProductsCategories>,
  ) {}

  async create(dto?: CreateProductsDto) {
    if (!dto) {
      throw new BadRequestException('Request body is required');
    }

    const { categoryIds, images, ...productData } = dto;
    const categories = await this.resolveCategoriesByIds(categoryIds);

    const product = this.productRepo.create({
      ...productData,
      categories,
      images: (images || []).map((image) => ({ url: image.url })),
    });

    return this.productRepo.save(product);
  }

  async findAll() {
    return this.productRepo.find({
      relations: ['categories', 'images'],
    });
  }

  async findOne(id: string) {

    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['categories', 'images'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductsDto) {

    const product = await this.findOne(id);
    const { categoryIds, name, description, images } = dto;

    if (name !== undefined && name.trim().length === 0) {
      throw new BadRequestException('name must be longer than 0 characters');
    }

    if (description !== undefined && description.trim().length === 0) {
      throw new BadRequestException('description must be longer than 0 characters');
    }

    if (name !== undefined) {
      product.name = name;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (categoryIds !== undefined) {
      product.categories = await this.resolveCategoriesByIds(categoryIds);
    }

    if (images !== undefined) {
      product.images = images.map((image) => {
        const productImage = new Images();
        productImage.url = image.url;
        return productImage;
      });
    }

    return this.productRepo.save(product);
  }

  async removeCategory(productId: string, categoryId: string) {

    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.categories = (product.categories || []).filter(
      (category) => category.id !== categoryId,
    );

    return this.productRepo.save(product);
  }

  async remove(id: string) {

    const product = await this.findOne(id);
    return this.productRepo.remove(product);
  }

  private async resolveCategoriesByIds(categoryIds?: string[]) {
    if (categoryIds === undefined) {
      return undefined;
    }

    if (!Array.isArray(categoryIds)) {
      throw new BadRequestException('categoryIds must be an array');
    }

    if (categoryIds.length === 0) {
      return [];
    }

    const uniqueIds = Array.from(new Set(categoryIds));

    const categories = await this.categoryRepo.find({
      where: { id: In(uniqueIds) },
    });

    if (categories.length !== uniqueIds.length) {
      throw new NotFoundException('One or more categories not found');
    }

    return categories;
  }
}