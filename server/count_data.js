const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const letterCount = await prisma.letterRequest.count();
  const logCount = await prisma.logbook.count();
  console.log(`TOTAL_USERS: ${userCount}`);
  console.log(`TOTAL_LETTERS: ${letterCount}`);
  console.log(`TOTAL_LOGS: ${logCount}`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
