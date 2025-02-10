import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sampleProducts = [
    {
      name: 'Vaporesso Xros 4',
      category: 'vapes',
      image:
        'https://www.lepetitvapoteur.com/45668-large_default/pod-xros-4-vaporesso.jpg',
      items: [
        { name: 'Красный', availability: 100 },
        { name: 'Синий', availability: 5 },
        { name: 'Золотистый', availability: 25 },
        { name: 'Сиреневый', availability: 0 },
      ],
    },
    {
      name: 'Podonki V1',
      category: 'liquids',
      image: 'https://i.yapx.ru/YcHQOb.jpg',
      items: [
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
  ];

  for (const product of sampleProducts) {
    await prisma.product.create({
      data: {
        name: product.name,
        category: product.category,
        image: product.image,
        items: {
          create: product.items,
        },
      },
    });
  }

  console.log('Seed data added');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
