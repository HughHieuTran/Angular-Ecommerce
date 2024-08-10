import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';  // Import the Order entity

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  username?: string | undefined;

  @Column()
  password: string;  // Consider using a hashed password

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
