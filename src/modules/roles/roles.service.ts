import { NotFoundAppException } from '@/common/exceptions/not-found.exception';
import { CreateRoleDto } from '@/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@/modules/roles/dto/update-role.dto';
import { Role } from '@/modules/roles/entities/role.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RolesService.name);
  }

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll() {
    this.logger.info('Fetching all roles');
    const roles = await this.roleRepository.find({
      order: { id: 'ASC' },
    });

    this.logger.info({ count: roles.length }, 'Roles fetched successfully');

    return {
      message: 'Roles fetched successfully',
      data: {
        list: roles,
      },
    };
  }

  async findOne(id: number) {
    this.logger.info({ id }, 'Fetching role');

    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      this.logger.warn({ id }, 'Role not found');
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
