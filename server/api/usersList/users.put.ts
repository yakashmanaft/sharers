import { PrismaClient } from "@prisma/client" 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // ... Do whatever you want here
    const body = await readBody(event)
    const id = body.id
    const surname = body.surname
    const name = body.name
    const middleName = body.middleName
    const phone = body.phone
    const role = body.role
    const groupID = body.groupID
    const groupStatus = body.groupStatus

    if(!(id && surname && name && middleName && phone && role && groupID && groupStatus)) return createError({statusCode: 400, statusMessage: 'Missing id or some other data'})

    let user

    if(id && surname && name && middleName && phone && role && groupID && groupStatus)
    user = await prisma.users.update({
        where: {
            id: id,
        },
        data: {
            surname: surname,
            name: name,
            middleName: middleName,
            phone: phone,
            role: role,
            groupID: groupID,
            groupStatus: groupStatus 
        }
    })
    return user
  })