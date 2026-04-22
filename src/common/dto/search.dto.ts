import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  })
  @IsString()
  @MaxLength(100)
  search?: string;
}
