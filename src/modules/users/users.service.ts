import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PinoLogger } from 'nestjs-pino';
import { QueryFailedError, Repository } from 'typeorm';

import { User } from '@/modules/users/entities/user.entity';

import { CreateUserInput } from '@/common/types';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });

        if (existingUser) {
          throw new ConflictException('Email already exists');
        }
      }

      Object.assign(user, updateUserDto);

      const updatedUser = await this.userRepository.save(user);

      const { password, ...userWithoutPassword } = updatedUser;

      return {
        message: 'User updated successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update user');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async createUser(createUserInput: CreateUserInput) {
    try {
      const user = this.userRepository.create(createUserInput);

      return this.userRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const pgError = error as any;

        if (pgError.code === '23505') {
          throw new InternalServerErrorException('User already exists');
        }
      }

      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
