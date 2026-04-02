import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Products } from 'src/modules/products/entities/products.entity';
import { ProductsCategories } from 'src/modules/products-categories/entities/products-categories.entity';

@Entity()
export class Images {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column()
  url: string; // path ของรูป เช่น /uploads/products/uuid.jpg

  @ManyToOne(() => Products, (product) => product.images, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  product?: Products;

  @ManyToOne(() => ProductsCategories, (category) => category.images, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  category?: ProductsCategories;
}