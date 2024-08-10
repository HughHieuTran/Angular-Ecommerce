import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';  // Import the Order entity

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;  // Consider using a hashed password

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
