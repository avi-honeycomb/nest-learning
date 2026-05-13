import { RoleType } from '@/common/enums/role.enum';

export type AuthUser = {
  userId: number;
  email: string;
  role: RoleType;
};

export type EmailVerificationPayload = {
  sub: number;
  email: string;
  type: 'email-verification';
};
