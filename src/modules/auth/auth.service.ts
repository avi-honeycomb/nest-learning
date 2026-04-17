import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RoleType } from '@/common/enums/role.enum';
import { SignupDto } from '@/modules/auth/dto/signup.dto';
import { RolesService } from '@/modules/roles/roles.service';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
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

    const accessToken = await this.jwtService.signAsync(payload);

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
        isVerified: true,
      });

      console.log('User', user);

      return {
        message: 'Signup successful',
        data: null,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Signup failed');
    }
  }
}
