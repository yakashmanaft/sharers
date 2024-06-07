// import { useUsersStore } from '@/stores/users'

// const { loadData } = useUsersStore();
// const { users } = useUsersStore()

export default defineEventHandler(async (event) => {

    // await loadData()
    // console.log(users.value)

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