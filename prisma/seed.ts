import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      name: 'Vaporesso Xros 4',
      category: 'vapes',
      image:
        'https://www.lepetitvapoteur.com/45668-large_default/pod-xros-4-vaporesso.jpg',
      price: JSON.stringify([
        { amount: 2, cost: 93 },
        { amount: 5, cost: 80 },
        { amount: 10, cost: 77 },
      ]),
      items: {
        create: [
          { name: 'Красный', availability: 100 },
          { name: 'Синий', availability: 5 },
          { name: 'Золотистый', availability: 25 },
          { name: 'Сиреневый', availability: 0 },
        ],
      },
    },
  });
  await prisma.product.create({
    data: {
      name: 'Podonki V1',
      category: 'liquids',
      image: 'https://i.yapx.ru/YcHQOb.jpg',
      price: JSON.stringify([
        { amount: 5, cost: 9 },
        { amount: 10, cost: 8.5 },
        { amount: 20, cost: 8.1 },
        { amount: 50, cost: 7.8 },
        { amount: 100, cost: 7.5 },
      ]),
      items: {
        create: [
          { name: 'Лимонад, смородина', availability: 40 },
          { name: 'Вишня, яблоко', availability: 30 },
          { name: 'Лесные ягоды, лёд', availability: 10 },
          { name: 'Бабл гам, арбуз, мята', availability: 100 },
          { name: 'Малиновый лимонад, лёд', availability: 100 },
          { name: 'Тропические фрукты, лёд', availability: 50 },
          { name: 'Банан, клубника, лёд', availability: 0 },
          { name: 'Жвачка, абрикос', availability: 0 },
          { name: 'Двойное яблоко, лёд', availability: 0 },
          { name: 'Личи, лёд, виноград, мята', availability: 100 },
          { name: 'Классическая кола, лёд', availability: 100 },
          { name: 'Брусника, клюква, малина', availability: 20 },
          { name: 'Малина, вишня', availability: 150 },
          { name: 'Малина, клубника, жвачка', availability: 100 },
          { name: 'Черника, малина, мята, лёд', availability: 200 },
          { name: 'Вишня, лайм, лёд', availability: 5 },
        ],
      },
    },
  });

  console.log('Seed data added');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
