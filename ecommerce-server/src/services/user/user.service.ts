import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOneBy({ email });
    }

    async createUser(user: User): Promise<User> {
        const existingUser = await this.findByEmail(user.email);
        if(!user.username){
            throw new BadRequestException('username cant be empty');
        }
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }
    async loginUser(user: User): Promise<User> {
        const dbuser = await this.findByEmail(user.email);
        if (dbuser && dbuser.password == user.password) {
            return dbuser;
        } else {
            throw new UnauthorizedException('Invalid email or password');
        }
    }
}
