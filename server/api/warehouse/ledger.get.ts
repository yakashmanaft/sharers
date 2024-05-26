import { PrismaClient } from "@prisma/client" 
const prisma = new PrismaClient()

export default defineEventHandler(async () => {
    // ... Do whatever you want here
    // Сначала получаем массив из БД
   return await prisma.warehouseItemsLedger.findMany()
  })