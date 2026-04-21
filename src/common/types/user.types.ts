export type CreateUserInput = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  roleId: number;
  phone?: string;
  profileImage?: string;
  isActive?: boolean;
  isVerified?: boolean;
};
