import { IntersectionType } from '@nestjs/mapped-types';

import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { SearchDto } from '@/common/dto/search.dto';
import { parseBoolean } from '@/common/transformers/boolean.transformer';

class UserFilterDto {
  @IsOptional()
  @Transform(({ value }) => (value === null ? undefined : value))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roleId?: number;

  @IsOptional()
  @Transform(({ value }) => parseBoolean(value))
  @IsIn([true, false], {
    message: 'isVerified must be true or false',
  })
  isVerified?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseBoolean(value))
  @IsIn([true, false], {
    message: 'isActive must be true or false',
  })
  isActive?: boolean;
}

export class GetAllUsersDto extends IntersectionType(PaginationDto, SearchDto) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFilterDto)
  filter?: UserFilterDto;
}
