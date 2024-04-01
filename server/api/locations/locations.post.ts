import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // ... Do whatever you want here
  const body = await readBody(event)
  let project = null

  if (body.title)
    await prisma.locations.create({
      data: {
        uuid: body.uuid,
        title: body.title,
        type: body.type,
        address: body.address,
        ownerID: body.ownerID,
        ownerType: body.ownerType
      },
    }).then((response) => {
      project = response
    })

  return {
    project: project
  }
})