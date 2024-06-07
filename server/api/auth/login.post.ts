export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const user = {
        id: 2,
        // email: 'anfalov@camini-pk.ru',
        email: body.email,
        // password: 'Anfalov123[eq',
        password: body.password,
        surname: 'Анфалов',
        name: 'Сергей',
        middleName: 'Владимирович',
        role: 'ADMIN' 
    }
    // const user = {
    //     event.context.body,
    //     // password: event.context.body.password
    // }

    await setUserSession(event, {
        user,
        loggedInAt: new Date(),
    })

    return user
})