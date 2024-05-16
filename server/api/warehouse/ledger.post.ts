import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    let transaction = null

    if (body.itemTitle)
        await prisma.warehouseItemsLedger.create({
            data: {
                transactionType: body.transactionType,
                // itemID: body.itemID,
                itemTitle: body.itemTitle,
                authorID: body.authorID,
                locationFrom: body.locationFrom,
                locationFromID: body.locationFromID,
                locationTo: body.locationTo,
                locationToID: body.locationToID,
                prevOwnerID: body.prevOwnerID,
                prevOwnerType: body.prevOwnerType,
                currentOwnerID: body.currentOwnerID,
                currentOwnerType: body.currentOwnerType,
                prevResponsibleID: body.prevResponsibleID,
                currentResponsibleID: body.currentResponsibleID,
                qty: body.qty,
                measure: body.measure
            }
        }).then((response) => {
            transaction = response
        })

    return {
        transaction: transaction
    }
})


