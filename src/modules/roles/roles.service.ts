import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';

import { Role } from '@/modules/roles/entities/role.entity';

import { RoleType } from '@/common/enums/role.enum';
import { NotFoundAppException } from '@/common/exceptions/not-found.exception';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RolesService.name);
  }

  async findAll() {
    this.logger.info('Fetching all roles');

    try {
      const roles = await this.roleRepository.find({
        order: { id: 'ASC' },
      });

      this.logger.info({ count: roles.length }, 'Roles fetched successfully');

      return roles;
    } catch (error) {
      this.logger.error({ error }, 'Failed to fetch roles');

      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }

  async findOne(id: number) {
    this.logger.info({ id }, 'Fetching role');

    try {
      const role = await this.roleRepository.findOne({
        where: { id },
      });

      if (!role) {
        this.logger.warn({ id }, 'Role not found');
        throw new NotFoundAppException('Role not found');
      }

      this.logger.info({ id }, 'Role fetched successfully');

      return role;
    } catch (error) {
      if (error instanceof NotFoundAppException) {
        throw error;
      }

      this.logger.error({ id, error }, 'Failed to fetch role');
      throw new InternalServerErrorException('Failed to fetch role');
    }
  }

  async findRoleIdByType(type: RoleType): Promise<number> {
    this.logger.info({ type }, 'Fetching role id by type');

    try {
      const role = await this.roleRepository.findOne({
        where: { name: type },
        select: { id: true },
      });

      if (!role) {
        this.logger.warn({ type }, 'Role not found');
        throw new NotFoundException(`Role '${type}' not found`);
      }

      this.logger.info({ id: role.id, type }, 'Role id fetched');

      return role.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error({ type, error }, 'Failed to fetch role id');

      throw new InternalServerErrorException('Failed to fetch role');
    }
  }
}
