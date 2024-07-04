import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // ... Do whatever you want here
  const body = await readBody(event)
  let company = null

  if (body.title)
    await prisma.organizations.create({
      data: {
        uuid: body.uuid,
        title: body.title,
        ownerID: body.ownerID,
        sharers: body.sharers
      },
    }).then((response) => {
      company = response
    })

  return {
    company: company
  }
})