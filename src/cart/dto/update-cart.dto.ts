import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCartDto {
  @IsArray()
  @IsNotEmpty()
  items: { productId: number; itemId: number; count: number }[];

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
