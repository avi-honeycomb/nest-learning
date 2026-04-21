export type AuthUser = {
  userId: number;
  email: string;
  role: string;
};

export type EmailVerificationPayload = {
  sub: number;
  email: string;
  type: 'email-verification';
};
