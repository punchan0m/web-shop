import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Products } from 'src/modules/products/entities/products.entity';
import { Images } from 'src/modules/images/entities/images.entity';

@Entity()
export class ProductsCategories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Images, (image) => image.category, {
    nullable: true,
    cascade: ['insert', 'update'],
  })
  images: Images[];

  @ManyToMany(() => Products, (product) => product.categories, { nullable: true })
  products: Products[];
}