const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const supervisorPassword = await bcrypt.hash('super123', 10);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ims.com' },
    update: {},
    create: {
      email: 'admin@ims.com',
      name: 'System Administrator',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });

  // 2. Create Supervisors
  const supervisors = [
    { email: 'sarah.supervisor@univ.edu', name: 'Dr. Sarah Wilson' },
    { email: 'john.smith@univ.edu', name: 'Prof. John Smith' }
  ];

  for (const s of supervisors) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        name: s.name,
        password: supervisorPassword,
        role: 'SUPERVISOR',
        status: 'ACTIVE',
        department: 'Computer Science'
      }
    });
  }

  // 3. Create Sample Opportunities
  const opportunities = [
    {
      title: 'Full Stack Developer Intern',
      company: 'TechCorp Solutions',
      location: 'Remote',
      type: 'Full-time',
      description: 'Work with React and Node.js on high-scale projects.',
      status: 'OPEN'
    },
    {
      title: 'Data Analyst Intern',
      company: 'DataFlow Inc.',
      location: 'New York, NY',
      type: 'Part-time',
      description: 'Analyze large datasets and create visualizations.',
      status: 'OPEN'
    }
  ];

  for (const o of opportunities) {
    await prisma.internshipOpportunity.create({ data: o });
  }

  console.log('🌱 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
