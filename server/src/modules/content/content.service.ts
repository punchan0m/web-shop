import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { ContentImage, ContentSettings } from './entities/content.entity';
import { UpdateLayoutContentDto } from './dto/update-layout-content.dto';
import { UpdateHomeContentDto } from './dto/update-home-content.dto';
import { UpdateAboutContentDto } from './dto/update-about-content.dto';
import { UpdateContactContentDto } from './dto/update-contact-content.dto';

const HOME_IMAGE_MAX = 5;
const ABOUT_IMAGE_MAX = 20;
const DEFAULT_CONTACT_MAP_QUERY = 'Q8MV+GJ Pak Trae, Ranot District, Songkhla';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentSettings)
    private readonly contentRepo: Repository<ContentSettings>,
  ) {}

  async getContent() {
    return this.ensureSingleton();
  }

  async updateLayout(dto: UpdateLayoutContentDto) {
    const content = await this.ensureSingleton();

    content.siteName = dto.navbarTitle.trim() || 'shopname';
    content.footerLeft = dto.footerLeft.trim() || 'Curating with intent since 2026.';
    content.footerRight = dto.footerRight.trim() || content.siteName;

    return this.contentRepo.save(content);
  }

  async updateHome(dto: UpdateHomeContentDto) {
    const content = await this.ensureSingleton();

    if (dto.siteName !== undefined) {
      content.siteName = dto.siteName.trim() || 'shopname';
    }

    content.homeTitle = dto.title.trim();
    content.homeDescription = dto.description?.trim() || '';

    if (dto.images) {
      this.assertImageLimit(0, dto.images.length, HOME_IMAGE_MAX, 'Home');
      content.homeImages = dto.images;
    }

    return this.contentRepo.save(content);
  }

  async updateAbout(dto: UpdateAboutContentDto) {
    const content = await this.ensureSingleton();

    content.aboutTitle = dto.title.trim();
    content.aboutDescription = dto.description?.trim() || '';

    if (dto.images) {
      this.assertImageLimit(0, dto.images.length, ABOUT_IMAGE_MAX, 'About');
      content.aboutImages = dto.images;
    }

    return this.contentRepo.save(content);
  }

  async updateContact(dto: UpdateContactContentDto) {
    const content = await this.ensureSingleton();

    content.contactTitle = dto.title.trim();
    content.contactDescription = dto.description?.trim() || '';
    content.contactMapQuery = dto.mapQuery?.trim() || DEFAULT_CONTACT_MAP_QUERY;
    content.contactEmail = dto.email?.trim() || '';
    content.contactGmail = dto.email?.trim() || dto.gmail?.trim() || '';
    content.contactPhone = dto.phone?.trim() || '';
    content.contactPhoneAlt = dto.phoneAlt?.trim() || '';
    content.contactFacebook = dto.facebook?.trim() || '';
    content.contactInstagram = dto.instagram?.trim() || '';
    content.contactLine = dto.line?.trim() || '';
    content.contactLatitude = dto.latitude?.trim() || '';
    content.contactLongitude = dto.longitude?.trim() || '';
    content.contactZoom = dto.zoom ?? 14;

    return this.contentRepo.save(content);
  }

  async addHomeImages(images: ContentImage[]) {
    const content = await this.ensureSingleton();
    this.assertImageLimit(content.homeImages.length, images.length, HOME_IMAGE_MAX, 'Home');
    content.homeImages = [...content.homeImages, ...images];
    return this.contentRepo.save(content);
  }

  async addAboutImages(images: ContentImage[]) {
    const content = await this.ensureSingleton();
    this.assertImageLimit(content.aboutImages.length, images.length, ABOUT_IMAGE_MAX, 'About');
    content.aboutImages = [...content.aboutImages, ...images];
    return this.contentRepo.save(content);
  }

  async removeHomeImage(imageId: string) {
    const content = await this.ensureSingleton();
    const image = content.homeImages.find((item) => item.id === imageId);
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    this.deleteFile(image.url);
    content.homeImages = content.homeImages.filter((item) => item.id !== imageId);
    return this.contentRepo.save(content);
  }

  async removeAboutImage(imageId: string) {
    const content = await this.ensureSingleton();
    const image = content.aboutImages.find((item) => item.id === imageId);
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    this.deleteFile(image.url);
    content.aboutImages = content.aboutImages.filter((item) => item.id !== imageId);
    return this.contentRepo.save(content);
  }

  private async ensureSingleton() {
    let content = await this.contentRepo.findOne({ where: {} });

    if (!content) {
      content = this.contentRepo.create({
        siteName: 'shopname',
        footerLeft: 'Curating with intent since 2026.',
        footerRight: 'shopname',
        homeTitle: 'Objects with intent, not noise.',
        homeDescription:
          'Build your catalog with an editorial feeling. Fast operations in admin, expressive storefront for customers.',
        homeImages: [],
        aboutTitle: 'Curation is a product decision.',
        aboutDescription:
          'We curate catalog, tone, and interaction as one system. The stack is practical: Router, React Query, Axios, Zod, and focused features.',
        aboutImages: [],
        contactTitle: 'Studio',
        contactDescription: '',
        contactMapQuery: DEFAULT_CONTACT_MAP_QUERY,
        contactEmail: 'support@editorial-merchant.local',
        contactGmail: 'support@editorial-merchant.local',
        contactPhone: '',
        contactPhoneAlt: '',
        contactFacebook: '',
        contactInstagram: '',
        contactLine: '',
        contactLatitude: '',
        contactLongitude: '',
        contactZoom: 14,
      });
      content = await this.contentRepo.save(content);
    }

    return content;
  }

  private assertImageLimit(current: number, incoming: number, max: number, label: string) {
    if (current + incoming > max) {
      throw new BadRequestException(`${label} images must not exceed ${max}`);
    }
  }

  private deleteFile(url: string) {
    const absolutePath = join(process.cwd(), 'src', url.replace('/uploads/', 'uploads/'));
    if (existsSync(absolutePath)) {
      unlinkSync(absolutePath);
    }
  }
}
