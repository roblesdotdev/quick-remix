import { PrismaClient } from '@prisma/client'
import { createPassword, createUser } from './utils'

const prisma = new PrismaClient()

async function seed() {
  console.log('๐ฑ Seeding...')
  console.time(`๐ฑ Database has been seeded`)

  console.time('๐งน Cleaned up the database...')
  await prisma.user.deleteMany({ where: {} })
  console.timeEnd('๐งน Cleaned up the database...')

  console.time('๐ค Create test user...')
  const userData = createUser('remixer')
  await prisma.user.create({
    data: {
      ...userData,
      password: {
        create: createPassword(userData.username),
      },
    },
  })
  console.timeEnd('๐ค Create test user...')

  console.timeEnd(`๐ฑ Database has been seeded`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
