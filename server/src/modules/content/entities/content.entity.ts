import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type ContentImage = {
  id: string;
  url: string;
};

@Entity()
export class ContentSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ default: 'shopname' })
  siteName: string;

  @Column({ default: 'Curating with intent since 2026.' })
  footerLeft: string;

  @Column({ default: 'shopname' })
  footerRight: string;

  @Column({ default: 'Objects with intent, not noise.' })
  homeTitle: string;

  @Column({ type: 'text', default: '' })
  homeDescription: string;

  @Column({ type: 'simple-json', default: '[]' })
  homeImages: ContentImage[];

  @Column({ default: 'Curation is a product decision.' })
  aboutTitle: string;

  @Column({ type: 'text', default: '' })
  aboutDescription: string;

  @Column({ type: 'simple-json', default: '[]' })
  aboutImages: ContentImage[];

  @Column({ default: 'Studio' })
  contactTitle: string;

  @Column({ type: 'text', default: '' })
  contactDescription: string;

  @Column({ type: 'text', default: 'Q8MV+GJ Pak Trae, Ranot District, Songkhla' })
  contactMapQuery: string;

  @Column({ default: 'support@editorial-merchant.local' })
  contactEmail: string;

  @Column({ default: 'support@editorial-merchant.local' })
  contactGmail: string;

  @Column({ type: 'text', default: '' })
  contactPhone: string;

  @Column({ type: 'text', default: '' })
  contactPhoneAlt: string;

  @Column({ type: 'text', default: '' })
  contactFacebook: string;

  @Column({ type: 'text', default: '' })
  contactInstagram: string;

  @Column({ type: 'text', default: '' })
  contactLine: string;

  @Column({ type: 'text', default: '' })
  contactLatitude: string;

  @Column({ type: 'text', default: '' })
  contactLongitude: string;

  @Column({ type: 'int', default: 14 })
  contactZoom: number;
}
