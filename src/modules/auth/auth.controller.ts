import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { SignupDto } from '@/modules/auth/dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

type AuthUser = {
  userId: number;
  email: string;
  role: string;
};

const ACCESS_TOKEN_COOKIE = 'access_token';
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    response.cookie(ACCESS_TOKEN_COOKIE, result.accessToken, {
      httpOnly: true,
      secure: false, // make true in production with HTTPS
      sameSite: 'lax',
      maxAge: ONE_DAY_IN_MS,
    });

    return {
      message: 'Login successful',
      data: {
        user: result.user,
      },
    };
  }

  @Get('profile')
  getProfile(@CurrentUser() user: AuthUser) {
    return {
      message: 'Profile fetched successfully',
      data: {
        user,
      },
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN_COOKIE, {
      httpOnly: true,
      secure: false, // make true in production with HTTPS
      sameSite: 'lax',
    });

    return {
      message: 'Logout successful',
    };
  }
}
