import { PrismaClient } from "@prisma/client" 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // ... Do whatever you want here
    const body = await readBody(event)
    let user = null
    let error = null
    if(body.id)
    await prisma.users.deleteMany({

        where: {
          id: body.id
        },
      }).then((response) => {
        user = response
      }).catch(async (e) => {
        error = e
      })

    if(error) 
      return createError({statusCode: 500, statusMessage: 'Server error bleatb! при удалении user'})

    return user
  })