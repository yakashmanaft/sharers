import { PrismaClient } from "@prisma/client" 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const salaryID = body.id
    const wageRate = body.wageRate
    const fundList = body.fundList

    let salary;

    salary = await prisma.salary.update({
        where: {
            id: salaryID,
        },
        data: {
            wageRate: wageRate,
            list: fundList
        }
    })

    return salary
})