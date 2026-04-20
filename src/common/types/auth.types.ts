export type EmailVerificationPayload = {
  sub: number;
  email: string;
  type: 'email-verification';
};
