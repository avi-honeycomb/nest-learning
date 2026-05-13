import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLE_PERMISSIONS } from '@/common/constants/role-permissions.constant';
import { PERMISSION_KEY } from '@/common/decorators/permission.decorator';
import { ModuleType, PermissionType } from '@/common/enums/common.enum';
import { AuthUser } from '@/common/types/auth.types';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.get<{
      module: ModuleType;
      action: PermissionType;
    }>(PERMISSION_KEY, context.getHandler());

    // If API has no @Permission decorator, allow it
    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser;

    if (!user?.role) {
      throw new ForbiddenException('User role not found');
    }

    const isAllowed =
      ROLE_PERMISSIONS?.[user.role]?.[permission.module]?.[permission.action];

    if (!isAllowed) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}
