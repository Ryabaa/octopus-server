import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule, UserModule],
  providers: [GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
