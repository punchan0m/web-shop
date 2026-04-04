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
  HttpStatus,
  HttpCode,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { ProductsCategoriesService } from './products-categories.service';
import { CreateProductsCategoriesDto } from './dto/create-products-categories.dto';
import { UpdateProductsCategoriesDto } from './dto/update-products-categories.dto';

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


@Controller('products-categories')
export class ProductsCategoriesController {
  constructor(private readonly service: ProductsCategoriesService) {}

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
  create(@Body() dto?: CreateProductsCategoriesDto) {
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
    @Body() body: { name?: string; description?: string },
  ) {
    if (!body.name || body.name.trim().length === 0) {
      throw new BadRequestException('name is required');
    }

    return this.service.create({
      name: body.name,
      description: body.description,
      images: (files || []).map((file) => ({
        url: `/uploads/${file.filename}`,
      })),
    });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateProductsCategoriesDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}