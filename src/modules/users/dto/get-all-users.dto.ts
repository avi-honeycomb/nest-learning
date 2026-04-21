import { IsInt, IsOptional } from 'class-validator';

export class GetAllUsersDto {
  @IsOptional()
  @IsInt()
  page?: number;
}
