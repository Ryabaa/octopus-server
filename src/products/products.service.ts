import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    const allProducts = await this.prisma.product.findMany({
      include: { items: true },
    });

    const productsWithParsedPrice = allProducts.map((product) => ({
      ...product,
      price: JSON.parse(product.price as string),
    }));

    return productsWithParsedPrice;
  }
}
