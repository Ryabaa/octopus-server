import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateCart(@Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(updateCartDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }
}
