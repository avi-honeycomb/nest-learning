import { unlink } from 'node:fs/promises';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { fileTypeFromFile } from 'file-type';

import { SignupDto } from '@/modules/auth/dto/signup.dto';
import { MailService } from '@/modules/mail/mail.service';
import { RolesService } from '@/modules/roles/roles.service';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

import { IMAGE_ALLOWED_TYPES } from '@/common/constants/file.constants';
import { RoleType } from '@/common/enums/role.enum';
import type {
  AuthUser,
  EmailVerificationPayload,
} from '@/common/types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isVerified) {
      const token = this.generateEmailVerificationToken(user);

      await this.mailService.sendVerificationEmail(
        user.email,
        user.firstName,
        token,
      );

      throw new UnauthorizedException(
        'Please verify your email first. A new verification email has been sent.',
      );
    }

    return user;
  }

  async login(email: string, password: string) {
    try {
      const user = await this.validateUser(email, password);

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role?.name,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('APP_JWT_SECRET'),
        expiresIn:
          this.configService.get<JwtSignOptions['expiresIn']>(
            'APP_JWT_EXPIRES_IN',
          ),
      });

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role?.name,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // optional: log error
      console.error('Login error:', error);

      throw new InternalServerErrorException('Login failed');
    }
  }

  async signup(signupDto: SignupDto, file?: Express.Multer.File) {
    try {
      const existingUser = await this.usersService.findByEmail(signupDto.email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      if (file?.path) {
        const detectedType = await fileTypeFromFile(file.path);

        if (!detectedType || !IMAGE_ALLOWED_TYPES.includes(detectedType.mime)) {
          await unlink(file.path);
          throw new BadRequestException('Invalid file type');
        }
      }

      const roleId = await this.rolesService.findRoleIdByType(RoleType.USER);

      const hashedPassword = await bcrypt.hash(signupDto.password, 10);

      const imagePath = file
        ? `/uploads/profileImages/${file.filename}`
        : undefined;

      const user = await this.usersService.createUser({
        ...signupDto,
        roleId,
        password: hashedPassword,
        profileImage: imagePath,
        isActive: true,
        isVerified: false,
      });

      const token = this.generateEmailVerificationToken(user);

      await this.mailService.sendVerificationEmail(
        user.email,
        user.firstName,
        token,
      );

      return {
        message: 'Signup successful. Please verify your email.',
        data: null,
      };
    } catch (error) {
      if (file?.path) {
        try {
          await unlink(file.path);
        } catch {
          // optional: log file delete failure
        }
      }

      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Signup failed');
    }
  }

  generateEmailVerificationToken(user: User) {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        type: 'email-verification',
      },
      {
        expiresIn: '1h',
        secret: this.configService.get<string>('APP_JWT_EMAIL_SECRET'),
      },
    );
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify<EmailVerificationPayload>(token, {
        secret: this.configService.get<string>('APP_JWT_EMAIL_SECRET'),
      });

      if (payload.type !== 'email-verification') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.usersService.findOne(payload.sub);

      if (!user.data) {
        throw new NotFoundException('User not found');
      }

      if (user.data.isVerified) {
        return {
          message: 'Email already verified',
          data: null,
        };
      }

      await this.usersService.update(user.data.id, {
        isVerified: true,
      });

      return {
        message: 'Email verified successfully',
        data: null,
      };
    } catch (error) {
      console.log('error', error);

      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Verification link expired');
      }

      throw new UnauthorizedException('Invalid verification token');
    }
  }

  async getProfile(currentUser: AuthUser) {
    try {
      const user = await this.usersService.findOne(currentUser.userId);

      if (!user.data) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'Profile fetched successfully',
        data: {
          user,
        },
      };
    } catch (error) {
      console.log('error', error);

      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Verification link expired');
      }

      throw new UnauthorizedException('Invalid verification token');
    }
  }
}
