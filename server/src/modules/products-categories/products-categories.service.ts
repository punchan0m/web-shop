import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsCategories } from './entities/products-categories.entity';
import { Images } from '../images/entities/images.entity';
import { CreateProductsCategoriesDto } from './dto/create-products-categories.dto';
import { UpdateProductsCategoriesDto } from './dto/update-products-categories.dto';


@Injectable()
export class ProductsCategoriesService {
  constructor(
    @InjectRepository(ProductsCategories)
    private repo: Repository<ProductsCategories>,
  ) {}

  async create(dto?: CreateProductsCategoriesDto) {
    if (!dto) {
      throw new BadRequestException('Request body is required');
    }

    if (dto.name.trim().length === 0) {
      throw new BadRequestException('name must be longer than 0 characters');
    }

    if (dto.description !== undefined && dto.description.trim().length === 0) {
      throw new BadRequestException('description must be longer than 0 characters');
    }

    const category = this.repo.create({
      name: dto.name,
      description: dto.description,
      images: (dto.images || []).map((image) => {
        const categoryImage = new Images();
        categoryImage.url = image.url;
        return categoryImage;
      }),
    });

    return this.repo.save(category);
  }

  async findAll() {
    return this.repo.find({
      relations: ['products', 'images'],
    });
  }

  async findOne(id: string) {

    const category = await this.repo.findOne({
      where: { id },
      relations: ['products', 'images'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateProductsCategoriesDto) {

    const category = await this.findOne(id);

    if (dto.name !== undefined && dto.name.trim().length === 0) {
      throw new BadRequestException('name must be longer than 0 characters');
    }

    if (dto.description !== undefined && dto.description.trim().length === 0) {
      throw new BadRequestException('description must be longer than 0 characters');
    }

    if (dto.name !== undefined) {
      category.name = dto.name;
    }

    if (dto.description !== undefined) {
      category.description = dto.description;
    }

    return this.repo.save(category);
  }

  async remove(id: string) {

    const category = await this.findOne(id);
    return this.repo.remove(category);
  }
}