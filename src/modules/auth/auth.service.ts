import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { SignupDto } from '@/modules/auth/dto/signup.dto';
import { MailService } from '@/modules/mail/mail.service';
import { RolesService } from '@/modules/roles/roles.service';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

import { RoleType } from '@/common/enums/role.enum';
import { EmailVerificationPayload } from '@/common/types/auth.types';

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
    const user = await this.validateUser(email, password);

    console.log('user', user);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('jwt.secret'),
      expiresIn:
        this.configService.getOrThrow<JwtSignOptions['expiresIn']>(
          'jwt.expiresIn',
        ) || '1d',
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role?.name,
      },
    };
  }

  async signup(signupDto: SignupDto) {
    try {
      const existingUser = await this.usersService.findByEmail(signupDto.email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const roleId = await this.rolesService.findRoleIdByType(RoleType.USER);

      const hashedPassword = await bcrypt.hash(signupDto.password, 10);

      const user = await this.usersService.createUser({
        ...signupDto,
        roleId,
        password: hashedPassword,
        isActive: true,
        isVerified: false,
      });

      console.log('User', user);

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
      if (error instanceof ConflictException) {
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
        secret: this.configService.get<string>('jwt.emailSecret'),
      },
    );
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify<EmailVerificationPayload>(token, {
        secret: this.configService.getOrThrow<string>('jwt.emailSecret'),
      });

      if (payload.type !== 'email-verification') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.usersService.findOne(5);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isVerified) {
        return {
          message: 'Email already verified',
          data: null,
        };
      }

      await this.usersService.update(user.id, {
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
}
