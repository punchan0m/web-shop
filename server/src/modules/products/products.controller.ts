import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';

const uploadDir = join(process.cwd(), 'src', 'uploads');

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const fileExtension = extname(file.originalname);
    cb(null, `${randomUUID()}${fileExtension}`);
  },
});

const imageFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new BadRequestException('Only image files are allowed'), false);
    return;
  }

  cb(null, true);
};


@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto?: CreateProductsDto) {
    if (!dto || !dto.name || dto.name.trim().length === 0) {
      throw new BadRequestException('name is required');
    }

    return this.service.create(dto);
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  createWithFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { name?: string; description?: string; categoryIds?: string | string[] },
  ) {
    if (!body.name || body.name.trim().length === 0) {
      throw new BadRequestException('name is required');
    }

    const categoryIds = this.parseCategoryIds(body.categoryIds);

    return this.service.create({
      name: body.name,
      description: body.description,
      categoryIds,
      images: (files || []).map((file) => ({
        url: `/uploads/${file.filename}`,
      })),
    });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateProductsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }

  @Delete(':id/categories/:categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
  ) {
    return this.service.removeCategory(id, categoryId);
  }

  private parseCategoryIds(categoryIds?: string | string[]) {
    if (categoryIds === undefined) {
      return undefined;
    }

    if (Array.isArray(categoryIds)) {
      return categoryIds.filter((id) => id.trim().length > 0);
    }

    const value = categoryIds.trim();
    if (value.length === 0) {
      return [];
    }

    if (value.startsWith('[')) {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new BadRequestException('categoryIds must be an array');
        }
        return parsed;
      } catch {
        throw new BadRequestException('categoryIds must be a valid JSON array');
      }
    }

    return value.split(',').map((id) => id.trim()).filter((id) => id.length > 0);
  }
}