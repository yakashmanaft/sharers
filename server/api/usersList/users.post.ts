import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // ... Do whatever you want here
  const body = await readBody(event)
  let user = null

  if (body.name)
    await prisma.users.create({
      data: {
        uuid: body.uuid,
        email: body.email,
        password: body.password,
        name: body.name,
        middleName: body.middleName,
        surname: body.surname,
        phone: body.phone,
        groupID: body.groupID,
        groupStatus: body.groupStatus,
        role: body.role
      },
    }).then((response) => {
      user = response
    })

  return {
    user: user
  }
})