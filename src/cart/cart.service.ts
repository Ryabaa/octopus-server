import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { getPriceByCount } from './helpers';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async updateCart(updateCartDto: UpdateCartDto) {
    try {
      const { userId, items } = updateCartDto;

      const cartItems = items.map((item) => ({
        userId: userId.toString(),
        productId: item.productId,
        itemId: item.itemId,
        count: item.count,
      }));

      await this.prisma.$transaction(async (prisma) => {
        await prisma.cartItem.deleteMany({
          where: { userId: userId.toString() },
        });

        if (cartItems.length > 0) {
          await prisma.cartItem.createMany({
            data: cartItems,
          });
        }
      });
    } catch (error) {
      new BadRequestException(error);
    }
  }

  async getCart(userId: string) {
    console.log(userId);
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId: userId },
    });

    if (!cartItems.length) {
      return {
        cart: [],
        productCount: {},
        cartCount: 0,
        cartPrice: 0,
        insufficientProducts: [],
      };
    }

    const productIdList = [...new Set(cartItems.map((item) => item.productId))];

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIdList } },
      select: { id: true, price: true },
    });

    let cartPrice = 0;
    const insufficientProducts = [];

    const productCount: Record<string, number> = cartItems.reduce(
      (acc: Record<string, number>, item: any) => {
        acc[item.productId] = (acc[item.productId] || 0) + item.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const cartCount = cartItems.reduce(
      (total: any, item: any) => total + item.count,
      0,
    );

    for (const productId of productIdList) {
      const product = products.find((p) => p.id === productId);
      if (!product) continue;

      const priceList = Array.isArray(product.price)
        ? product.price
        : JSON.parse(product.price as string);
      const minRequiredAmount = Math.min(...priceList.map((p) => p.amount));

      const totalCount = productCount[productId];
      if (totalCount < minRequiredAmount) {
        insufficientProducts.push({
          productId: productId,
          minCount: minRequiredAmount,
        });
      }

      const itemsForProduct = cartItems.filter(
        (item) => item.productId === productId,
      );
      for (const item of itemsForProduct) {
        const itemPrice = getPriceByCount(priceList, cartCount);
        cartPrice += itemPrice * item.count;
      }
    }

    const filteredCart = cartItems.map((item) => ({
      productId: item.productId,
      itemId: item.itemId,
      count: item.count,
    }));

    return {
      cart: filteredCart,
      cartCount,
      productCount,
      cartPrice,
      insufficientProducts: insufficientProducts,
    };
  }
}
