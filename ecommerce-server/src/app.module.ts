import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user/user.controller';
import { ProductController } from './controllers/product/product.controller';
import { OrderController } from './controllers/order/order.controller';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { UserService } from './services/user/user.service';
import { ProductService } from './services/product/product.service';
import { OrderService } from './services/order/order.service';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'final',
    entities: [User, Product, Order, OrderItem],
    synchronize: true
  }),
  TypeOrmModule.forFeature([User, Product, Order, OrderItem]),
  ],
  controllers: [AppController, UserController, ProductController, OrderController],
  providers: [AppService, UserService, ProductService, OrderService],
})
export class AppModule { }
