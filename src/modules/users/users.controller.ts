import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { GetAllUsersDto } from '@/modules/users/dto/get-all-users.dto';

import { Permission } from '@/common/decorators/permission.decorator';
import { ModuleType, PermissionType } from '@/common/enums/common.enum';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('list')
  // @Roles(RoleType.ADMIN)
  @Permission(ModuleType.USERS, PermissionType.VIEW)
  @HttpCode(HttpStatus.OK)
  async findAll(@Body() body: GetAllUsersDto) {
    console.log('Request Body:', body);

    const result = await this.usersService.findAll(body);

    return {
      message: 'Users fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  // @Roles(RoleType.ADMIN)
  @Permission(ModuleType.USERS, PermissionType.VIEW)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
