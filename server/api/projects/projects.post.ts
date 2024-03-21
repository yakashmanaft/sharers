import { PrismaClient } from "@prisma/client" 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // ... Do whatever you want here
    const body = await readBody(event)
    let project = null

    if(body.title) 
        await prisma.projects.create({
        data: {
          uuid: body.uuid,
          title: body.title,
          address: body.address,
          partner: body.partner,
          creator: body.creator,
          workType: body.workType,
          completion: body.completion,
        },
      }).then((response) => {
        project = response
      })

    return {
      project: project
    }
  })