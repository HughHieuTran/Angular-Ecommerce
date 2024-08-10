import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user/user.controller';
import { ProductController } from './controllers/product/product.controller';
import { OrderController } from './controllers/order/order.controller';

@Module({
  imports: [TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:'admin',
    database:'final',
    entities:[User],
    synchronize:true
  }),
  TypeOrmModule.forFeature([User]),
],
  controllers: [AppController, UserController, ProductController, OrderController],
  providers: [AppService],
})
export class AppModule {}
