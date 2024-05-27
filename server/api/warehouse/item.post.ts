import { PrismaClient } from "@prisma/client" 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // ... Do whatever you want here
    const body = await readBody(event)
    let item = null

    if(body.title) 
        await prisma.warehouseItems.create({
        data: {
          uuid: body.uuid,
          title: body.title,
          type: body.type,
          qty: body.qty,
          measure: body.measure,
          location: body.location,
          locationID: body.locationID,
          // position пока не делаем
          serial: body.serial,
          productionDate: body.productionDate,
          ownerID: body.ownerID,
          ownerType: body.ownerType,
          responsible: body.responsible
        },
      }).then((response) => {
        item = response
      })

    return {
        item: item
    }
  })