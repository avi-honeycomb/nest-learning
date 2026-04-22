import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'PaginationRuleValidator', async: false })
export class PaginationRuleValidator implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    console.log('args', args);

    const body = args.object as {
      isPagination?: boolean;
      page?: number;
      pageSize?: number;
    };

    const isPagination = body.isPagination ?? true;

    if (isPagination === false) {
      return body.page === undefined && body.pageSize === undefined;
    }

    return true;
  }

  defaultMessage(): string {
    return 'page and pageSize should not be provided when isPagination is false';
  }
}
