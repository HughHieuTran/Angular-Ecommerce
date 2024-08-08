import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

@Controller('user')
export class UserController {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    @Get()
    async findAllUser(): Promise<User[]> {
        return await this.userRepository.find();
    }
    @Get(':id')
    async findUserById(@Param('id') id: any): Promise<User> {
        return await this.userRepository.findOne(id);
    }

    @Post()
    async createUser(@Body() user: User): Promise<InsertResult> {
        return await this.userRepository.insert(user);
    }

    @Put()
    async updateUser(@Body() user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    @Delete(':id')
    async deleteUserById(@Param('id') id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }
}
