import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [PrismaModule, PassportModule],
  providers: [CartService, JwtStrategy],
  controllers: [CartController],
})
export class CartModule {}
