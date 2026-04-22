import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';

import { PaginationRuleValidator } from '@/common/validators/pagination-rule.validator';

export class PaginationDto {
  @Transform(({ value }) =>
    value === undefined ? true : value === true || value === 'true',
  )
  @IsBoolean()
  @Validate(PaginationRuleValidator)
  isPagination: boolean = true;

  @ValidateIf((o: PaginationDto) => o.isPagination === true)
  @IsDefined({ message: 'page is required' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ValidateIf((o: PaginationDto) => o.isPagination === true)
  @IsDefined({ message: 'pageSize is required' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}
