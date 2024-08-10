import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user/user.service';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

@Controller('user')
export class UserController {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UserService
    ) { }

    @Get()
    async findAllUser(): Promise<User[]> {
        return await this.userRepository.find();
    }
    @Get(':email')
    async findUserByEmail(@Param('email') email: string): Promise<User> {
        return await this.userService.findByEmail(email);
    }

    @Post('register')
    async createUser(@Body() user: User): Promise<User> {
        return this.userService.createUser(user);
    }
    @Post('login')
    async validateUser(@Body() user: User): Promise<User> {
        return this.userService.loginUser(user);
    }
    @Put()
    async updateUser(@Body() user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
    @Delete(':email')
    async deleteUserById(@Param('id') id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }
}
