import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderItem } from './orderItem.entity';  // Assuming an OrderItem entity for many-to-many relationship

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  sku?: string;

  @Column({ default: 'DWST1429376-1' })
  trademark?: string;

  @Column({ default: 0 })
  width?: number;
  @Column({ default: 0 })
  length?: number;
  @Column({ default: 0 })
  height?: number;

  @Column({ default: 'Vietnam' })
  manufacturer?: string;

  @Column({ default: 'weight' })
  propertyName?: number;

  @Column({ default: '10kg' })
  propertyValue?: string;

  @Column({ default: 3 })
  rating?: number;

  @Column('decimal')
  price: number;

  @Column({ default: 0 })
  stock: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
