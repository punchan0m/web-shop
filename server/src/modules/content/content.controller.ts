import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { ContentService } from './content.service';
import { UpdateLayoutContentDto } from './dto/update-layout-content.dto';
import { UpdateHomeContentDto } from './dto/update-home-content.dto';
import { UpdateAboutContentDto } from './dto/update-about-content.dto';
import { UpdateContactContentDto } from './dto/update-contact-content.dto';

const uploadDir = join(process.cwd(), 'src', 'uploads', 'content');

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

const imageFileFilter = (_req: unknown, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new HttpException('Only image files are allowed', HttpStatus.BAD_REQUEST), false);
    return;
  }

  cb(null, true);
};

@Controller('content')
export class ContentController {
  constructor(private readonly service: ContentService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getContent() {
    return this.service.getContent();
  }

  @Patch('layout')
  @HttpCode(HttpStatus.OK)
  updateLayout(@Body() dto: UpdateLayoutContentDto) {
    return this.service.updateLayout(dto);
  }

  @Patch('home')
  @HttpCode(HttpStatus.OK)
  updateHome(@Body() dto: UpdateHomeContentDto) {
    return this.service.updateHome(dto);
  }

  @Patch('about')
  @HttpCode(HttpStatus.OK)
  updateAbout(@Body() dto: UpdateAboutContentDto) {
    return this.service.updateAbout(dto);
  }

  @Patch('contact')
  @HttpCode(HttpStatus.OK)
  updateContact(@Body() dto: UpdateContactContentDto) {
    return this.service.updateContact(dto);
  }

  @Post('home/images')
  @UseInterceptors(FilesInterceptor('files', 5, { storage, fileFilter: imageFileFilter, limits: { fileSize: 5 * 1024 * 1024 } }))
  @HttpCode(HttpStatus.CREATED)
  uploadHomeImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new HttpException('files are required', HttpStatus.BAD_REQUEST);
    }

    return this.service.addHomeImages(files.map((file) => ({ id: randomUUID(), url: `/uploads/content/${file.filename}` })));
  }

  @Post('about/images')
  @UseInterceptors(FilesInterceptor('files', 20, { storage, fileFilter: imageFileFilter, limits: { fileSize: 5 * 1024 * 1024 } }))
  @HttpCode(HttpStatus.CREATED)
  uploadAboutImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new HttpException('files are required', HttpStatus.BAD_REQUEST);
    }

    return this.service.addAboutImages(files.map((file) => ({ id: randomUUID(), url: `/uploads/content/${file.filename}` })));
  }

  @Delete('home/images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteHomeImage(@Param('imageId', new ParseUUIDPipe()) imageId: string) {
    return this.service.removeHomeImage(imageId);
  }

  @Delete('about/images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAboutImage(@Param('imageId', new ParseUUIDPipe()) imageId: string) {
    return this.service.removeAboutImage(imageId);
  }
}
