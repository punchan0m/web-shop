import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProductsCategories } from 'src/modules/products-categories/entities/products-categories.entity';
import { Images } from 'src/modules/images/entities/images.entity';

@Entity()
export class Products {
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

  @OneToMany(() => Images, (image) => image.product, {
    nullable: true,
    cascade: ['insert', 'update'],
  })
  images: Images[];

  @ManyToMany(() => ProductsCategories, (category) => category.products, { nullable: true })
  @JoinTable()
  categories?: ProductsCategories[];
}