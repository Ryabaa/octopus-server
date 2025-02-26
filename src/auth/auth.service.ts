import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private prisma: PrismaService,
  ) {}

  async googleAuthComplete(user: User, res: any) {
    const tokens = this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth-success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}&userId=${user.id}`,
    );
  }

  async login(userData) {
    const { email, password } = userData;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователя с таким Email не существует');
    }

    if (user.createdWith !== 'email') {
      throw new BadRequestException(
        'Пользователь с таким Email создан через Google, попробуйте войти через Google',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const tokens = this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
    };
  }

  async register(userData) {
    const existingUser = await this.userService.findByEmail(userData.email);

    if (existingUser) {
      throw new BadRequestException('Email занят другим пользователем');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      createdWith: 'email',
    };

    const newUser = await this.userService.createUser(user);
    const tokens = this.generateTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: newUser.id,
    };
  }

  generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      secret: process.env.JWT_ACCESS_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      secret: process.env.JWT_REFRESH_SECRET,
    });

    console.log('accessToken' + accessToken, 'refresh' + refreshToken);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    console.log('UPDATE:   ' + refreshToken);
    const hashedRefreshToken = await this.hashToken(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async refreshTokens(refreshToken: string) {
    console.log('шо не так?????' + refreshToken);
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.findById(payload.sub);

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!user || !isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.id, user.email);

      await this.updateRefreshToken(user.id, tokens.refreshToken);
      console.log(tokens.refreshToken);
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Failed to refresh tokens');
    }
  }

  async hashToken(token: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(token, saltRounds);
  }
}
