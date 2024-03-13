export default defineEventHandler(async (event) => {
    const user = {
        id: 6,
        email: 1,
        password: 1
    }
    await setUserSession(event, {
        user,
        loggedInAt: new Date(),
    })

    return user
})