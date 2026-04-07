import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Images } from './entities/images.entity';
import { Products } from '../products/entities/products.entity';
import { ProductsCategories } from '../products-categories/entities/products-categories.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {
  private readonly supabase: SupabaseClient | null;
  private readonly bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Images)
    private readonly imageRepo: Repository<Images>,
    @InjectRepository(Products)
    private readonly productRepo: Repository<Products>,
    @InjectRepository(ProductsCategories)
    private readonly categoryRepo: Repository<ProductsCategories>,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    this.bucketName = this.configService.get<string>('SUPABASE_STORAGE_BUCKET') || 'web-shop';
    this.supabase =
      supabaseUrl && supabaseServiceRoleKey
        ? createClient(supabaseUrl, supabaseServiceRoleKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          })
        : null;
  }

  async uploadAndCreate(input: {
    file: Express.Multer.File;
    productId?: string;
    categoryId?: string;
  }) {
    this.validateOwnerSelection(input.productId, input.categoryId);

    if (!this.supabase) {
      return this.uploadToLocal(input);
    }

    const fileExt = extname(input.file.originalname) || '';
    const ownerPrefix = input.productId ? 'products' : 'categories';
    const ownerId = input.productId || input.categoryId;
    const objectPath = `${ownerPrefix}/${ownerId}/${randomUUID()}${fileExt}`;

    const { error: uploadError } = await this.supabase.storage
      .from(this.bucketName)
      .upload(objectPath, input.file.buffer, {
        upsert: false,
        contentType: input.file.mimetype,
        cacheControl: '3600',
      });

    if (uploadError) {
      throw new BadRequestException(`Upload failed: ${uploadError.message}`);
    }

    return this.create({
      url: `/storage/v1/object/public/${this.bucketName}/${objectPath}`,
      productId: input.productId,
      categoryId: input.categoryId,
    });
  }

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

    const objectPath = this.resolveStorageObjectPath(image.url);
    if (objectPath && this.supabase) {
      await this.supabase.storage.from(this.bucketName).remove([objectPath]);
    } else if (image.url.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'src', image.url.replace(/^\//, ''));
      await unlink(filePath).catch(() => undefined);
    }

    return this.imageRepo.remove(image);
  }

  private async uploadToLocal(input: {
    file: Express.Multer.File;
    productId?: string;
    categoryId?: string;
  }) {
    const fileExt = extname(input.file.originalname) || '';
    const filename = `${randomUUID()}${fileExt}`;
    const uploadDir = join(process.cwd(), 'src', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    await writeFile(join(uploadDir, filename), input.file.buffer);

    return this.create({
      url: `/uploads/${filename}`,
      productId: input.productId,
      categoryId: input.categoryId,
    });
  }

  private resolveStorageObjectPath(url: string) {
    const marker = `/storage/v1/object/public/${this.bucketName}/`;
    const markerIndex = url.indexOf(marker);
    if (markerIndex === -1) {
      return null;
    }

    return url.slice(markerIndex + marker.length);
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
