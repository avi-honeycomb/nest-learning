import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';

import type { GetAllUsersDto } from './dto/get-all-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Post('list')
  // @UsePipes(PaginationValidationPipe)
  getList(@Body() getAllUsersDto: GetAllUsersDto, @Req() req: Request) {
    console.log('req.body =>', req.body);
    console.log('body =>', getAllUsersDto);

    return getAllUsersDto;
  }

  // @Post('list')
  // @UsePipes(PaginationValidationPipe)
  // async findAll(@Body() body: GetAllUsersDto) {
  //   console.log('Request Body:', body);

  //   const result = await this.usersService.findAll(body);

  //   return {
  //     message: 'Users fetched successfully',
  //     data: result,
  //   };
  // }

  @Get(':id')
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
