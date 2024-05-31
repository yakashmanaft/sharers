export default defineEventHandler(async (event) => {
    const user = {
        id: 2,
        email: 'anfalov@camini-pk.ru',
        password: 'Anfalov123[eq',
        surname: 'Анфалов',
        name: 'Сергей',
        middleName: 'Владимирович',
        role: 'ADMIN' 
    }
    await setUserSession(event, {
        user,
        loggedInAt: new Date(),
    })

    return user
})