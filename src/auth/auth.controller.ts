import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    return this.authService.googleAuthComplete(req.user, res);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Post('login')
  async login(@Body() DTO: LoginDto) {
    return this.authService.login(DTO);
  }

  @Post('register')
  async register(@Body() DTO: RegisterDto) {
    return this.authService.register(DTO);
  }

  @Post('check')
  @UseGuards(AuthGuard('jwt'))
  async getData() {
    console.log(1);
    return { message: 'uraaaa' };
  }
}
