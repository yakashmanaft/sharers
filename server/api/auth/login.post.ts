
export default defineEventHandler(async (event) => {


    const body = await readBody(event)

    const user = {
        id: body.id,
        email: body.email,
        // Пароль не показываем...
        // password: body.password,
        surname: body.surname,
        name: body.name,
        middleName: body.middleName,
        role: body.role,
        accessModules: body.accessModules
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