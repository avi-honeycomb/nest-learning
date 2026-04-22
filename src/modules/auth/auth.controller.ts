import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import type { Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

import { SignupDto } from '@/modules/auth/dto/signup.dto';

import {
  DEFAULT_FILE_SIZE,
  IMAGE_ALLOWED_TYPES,
} from '@/common/constants/file.constants';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import type { AuthUser } from '@/common/types/auth.types';
import { createMulterOptions } from '@/common/utils/file.utils';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

const ACCESS_TOKEN_COOKIE = 'access_token';
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Public()
  @Post('signup')
  @UseInterceptors(
    FileInterceptor(
      'file',
      createMulterOptions({
        folder: 'profileImages',
        prefix: 'profile',
        maxSize: DEFAULT_FILE_SIZE,
        allowedMimeTypes: IMAGE_ALLOWED_TYPES,
      }),
    ),
  )
  signup(
    @Body() signupDto: SignupDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.authService.signup(signupDto, file);
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('loginDto', loginDto);
    this.logger.info({ email: loginDto.email }, 'Login attempt');

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

  @Public()
  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: AuthUser) {
    return this.authService.getProfile(user);
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
