import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PinoLogger } from 'nestjs-pino';
import { QueryFailedError, Repository } from 'typeorm';

import { GetAllUsersDto } from '@/modules/users/dto/get-all-users.dto';
import { User } from '@/modules/users/entities/user.entity';

import { CreateUserInput } from '@/common/types';
import { buildFileUrl } from '@/common/utils/file.utils';

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

  async findAll(payload: GetAllUsersDto) {
    this.logger.info('Fetching all users');

    try {
      const {
        isPagination = true,
        page = 1,
        pageSize = 10,
        search,
        filter,
      } = payload;

      const query = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .select([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.email',
          'user.isActive',
          'user.isVerified',
          'user.phone',
          'user.profileImage',
          'user.createdAt',
          'user.updatedAt',
          'role.id',
          'role.name',
        ]);

      if (search) {
        const searchValue = `%${search}%`;

        const fields = [
          'user.firstName',
          'user.lastName',
          'user.email',
          'user.phone',
        ];

        const conditions = fields
          .map((field) => `${field} ILIKE :search`)
          .join(' OR ');

        query.andWhere(`(${conditions})`, { search: searchValue });
      }

      if (filter?.roleId !== undefined) {
        query.andWhere('user.roleId = :roleId', { roleId: filter.roleId });
      }

      if (filter?.isVerified !== undefined) {
        query.andWhere('user.isVerified = :isVerified', {
          isVerified: filter.isVerified,
        });
      }

      if (filter?.isActive !== undefined) {
        query.andWhere('user.isActive = :isActive', {
          isActive: filter.isActive,
        });
      }

      // Return all users (no pagination)
      if (!isPagination) {
        const list = await query.getMany();

        const updatedList = list.map((user) => ({
          ...user,
          profileImage: buildFileUrl(user.profileImage),
        }));

        return {
          list: updatedList,
          count: updatedList.length,
          pagination: null,
        };
      }

      // Apply pagination
      const skip = (page - 1) * pageSize;

      query.skip(skip).take(pageSize);

      const [list, total] = await query.getManyAndCount();

      const updatedList = list.map((user) => ({
        ...user,
        profileImage: buildFileUrl(user.profileImage),
      }));

      return {
        list: updatedList,
        count: updatedList.length,
        pagination: {
          page,
          pageSize,
          totalRecords: total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    } catch (error) {
      this.logger.error({ error, payload }, 'Failed to fetch users');

      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
        // select: {
        //   id: true,
        //   email: true,
        //   firstName: true,
        //   lastName: true,
        //   isActive: true,
        //   isVerified: true,
        //   createdAt: true,
        //   role: {
        //     id: true,
        //     name: true,
        //   },
        // },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'User fetched successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to fetch user');
    }
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
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    return user;
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
