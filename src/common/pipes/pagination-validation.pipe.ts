// import {
//   ArgumentMetadata,
//   BadRequestException,
//   Injectable,
//   PipeTransform,
// } from '@nestjs/common';

// import { PaginationDto } from '@/common/dto/pagination.dto';

// @Injectable()
// export class PaginationValidationPipe implements PipeTransform<PaginationDto> {
//   transform(value: PaginationDto, metadata: ArgumentMetadata): PaginationDto {
//     console.log('value', value);

//     // Only validate request body
//     if (metadata.type !== 'body') {
//       return value;
//     }

//     // Handle empty body safely
//     const { isPagination = true, page, pageSize } = value ?? {};

//     // ❌ Case 1: Pagination disabled but params passed
//     if (!isPagination && (page !== undefined || pageSize !== undefined)) {
//       throw new BadRequestException(
//         'Pagination is disabled. Do not pass page or pageSize',
//       );
//     }

//     // ❌ Case 2: Pagination enabled but params missing
//     if (isPagination && (page === undefined || pageSize === undefined)) {
//       throw new BadRequestException(
//         'page and pageSize are required when pagination is enabled',
//       );
//     }

//     return value;
//   }
// }
