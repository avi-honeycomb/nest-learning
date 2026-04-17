export type CreateUserInput = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  roleId: number;
  phone?: string;
  isActive?: boolean;
  isVerified?: boolean;
};
