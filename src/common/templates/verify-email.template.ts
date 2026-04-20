export const verifyEmailTemplate = (name: string, verifyUrl: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Email</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f4f6f8;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background:#4f46e5; color:#ffffff; padding:20px; text-align:center;">
                <h2 style="margin:0;">Welcome to Our App 🚀</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333;">
                <p>Hi <b>${name}</b>,</p>

                <p>Thanks for signing up! Please verify your email address by clicking the button below.</p>

                <div style="text-align:center; margin:30px 0;">
                  <a href="${verifyUrl}"
                     style="background:#4f46e5; color:#fff; padding:12px 24px; text-decoration:none; border-radius:6px; display:inline-block;">
                    Verify Email
                  </a>
                </div>

                <p>If the button doesn't work, copy and paste this link:</p>
                <p style="word-break:break-all; color:#4f46e5;">${verifyUrl}</p>

                <p>This link will expire in 1 hour.</p>

                <p>If you didn’t create this account, you can safely ignore this email.</p>

                <p>Thanks,<br/>Team</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
