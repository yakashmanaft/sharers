import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // ... Do whatever you want here
    const body = await readBody(event)
    const id = body.id
    // const title = body.title
    // const type = body.type
    const qty = body.qty

    if (!(id)) return createError({ statusCode: 400, statusMessage: 'Missing id or some other data' })

    let item

    if (id)
        item = await prisma.warehouseItems.update({
            where: {
                id: id,
            },
            data: {
                // title: title,
                qty: qty
            }
        })
    return item
})