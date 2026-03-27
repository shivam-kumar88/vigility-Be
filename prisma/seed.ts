import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting the seeding process...');

  await prisma.featureClicks.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);
  
  const usersData = [
    { username: 'shivam_dev', password: passwordHash, age: 28, gender: 'Male' },
    { username: 'product_manager', password: passwordHash, age: 35, gender: 'Female' },
    { username: 'data_analyst', password: passwordHash, age: 42, gender: 'Other' },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.create({ data: u });
    createdUsers.push(user);
  }

  const features = ['date_picker', 'filter_age', 'chart_bar', 'filter_gender'];
  const clicks = [];

  for (let i = 0; i < 100; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const randomFeature = features[Math.floor(Math.random() * features.length)];
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - randomDaysAgo);

    clicks.push({
      userId: randomUser.id,
      feature_name: randomFeature,
      timestamp: date,
    });
  }

  await prisma.featureClicks.createMany({ data: clicks });
  console.log('Seeding finished successfully. Added 3 users and 100 feature clicks.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });