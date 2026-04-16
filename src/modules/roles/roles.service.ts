import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { NotFoundAppException } from 'src/common/exceptions/not-found.exception';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll() {
    const roles = await this.roleRepository.find({
      order: { id: 'ASC' },
    });

    // throw new AppException(
    //   'Password cannot be same as email',
    //   HttpStatus.BAD_REQUEST,
    // );

    return {
      message: 'Roles fetched successfully',
      data: {
        list: roles,
      },
    };
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundAppException('Role not found');
    }

    return {
      message: 'Role fetched successfully',
      data: { role },
    };
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
