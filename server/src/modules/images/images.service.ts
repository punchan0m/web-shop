import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Images } from './entities/images.entity';
import { Products } from '../products/entities/products.entity';
import { ProductsCategories } from '../products-categories/entities/products-categories.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private readonly imageRepo: Repository<Images>,
    @InjectRepository(Products)
    private readonly productRepo: Repository<Products>,
    @InjectRepository(ProductsCategories)
    private readonly categoryRepo: Repository<ProductsCategories>,
  ) {}

  async create(dto: CreateImageDto) {
    this.validateOwnerSelection(dto.productId, dto.categoryId);

    const image = this.imageRepo.create({
      url: dto.url,
    });

    if (dto.productId) {
      image.product = await this.findProduct(dto.productId);
    }

    if (dto.categoryId) {
      image.category = await this.findCategory(dto.categoryId);
    }

    return this.imageRepo.save(image);
  }

  async findAll() {
    return this.imageRepo.find({
      relations: ['product', 'category'],
    });
  }

  async findOne(id: string) {
    const image = await this.imageRepo.findOne({
      where: { id },
      relations: ['product', 'category'],
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    return image;
  }

  async update(id: string, dto: UpdateImageDto) {
    const image = await this.findOne(id);

    if (dto.url !== undefined) {
      if (dto.url.trim().length === 0) {
        throw new BadRequestException('url must be longer than 0 characters');
      }
      image.url = dto.url;
    }

    if (dto.productId !== undefined || dto.categoryId !== undefined) {
      this.validateOwnerSelection(
        dto.productId === null ? undefined : dto.productId,
        dto.categoryId === null ? undefined : dto.categoryId,
      );

      image.product = undefined;
      image.category = undefined;

      if (dto.productId) {
        image.product = await this.findProduct(dto.productId);
      }

      if (dto.categoryId) {
        image.category = await this.findCategory(dto.categoryId);
      }
    }

    return this.imageRepo.save(image);
  }

  async remove(id: string) {
    const image = await this.findOne(id);
    return this.imageRepo.remove(image);
  }

  private validateOwnerSelection(productId?: string, categoryId?: string) {
    if (!productId && !categoryId) {
      throw new BadRequestException('Either productId or categoryId is required');
    }

    if (productId && categoryId) {
      throw new BadRequestException('Provide only one of productId or categoryId');
    }
  }

  private async findProduct(productId: string) {
    const product = await this.productRepo.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  private async findCategory(categoryId: string) {
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
