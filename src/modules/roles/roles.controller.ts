import { Controller, Get, Param } from '@nestjs/common';

import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll() {
    const roles = await this.rolesService.findAll();

    return {
      message: 'Roles fetched successfully',
      data: {
        list: roles,
        count: roles.length,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findOne(+id);

    return {
      message: 'Role fetched successfully',
      data: {
        role,
      },
    };
  }
}
