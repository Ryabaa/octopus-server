import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    const allProducts = this.prisma.product.findMany({
      include: { items: true },
    });
    console.log(allProducts);
    return allProducts;
  }
}
