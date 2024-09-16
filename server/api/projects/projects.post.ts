import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // ... Do whatever you want here
  const body = await readBody(event)
  let project = null

  if (body.title)
    await prisma.projects.create({
      data: {
        uuid: body.uuid,
        title: body.title,
        address: body.address,
        bandID: body.bandID,
        partnerID: body.partnerID,
        partnerType: body.partnerType,
        creator: body.creator,
        curator: body.curator,
        curatorType: body.curatorType,
        workType: body.workType,
        completion: body.completion,
        sharers: body.sharers,
        stages: body.stages
      },
    }).then((response) => {
      project = response
    })

  return {
    project: project
  }
})