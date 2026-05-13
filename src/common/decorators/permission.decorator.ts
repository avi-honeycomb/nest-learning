import { SetMetadata } from '@nestjs/common';

import { ModuleType, PermissionType } from '@/common/enums/common.enum';

export const PERMISSION_KEY = 'permission';

export const Permission = (module: ModuleType, action: PermissionType) =>
  SetMetadata(PERMISSION_KEY, { module, action });
