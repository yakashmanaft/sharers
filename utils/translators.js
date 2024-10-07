const { users } = storeToRefs(useUsersStore());

export const translateSharersInProject = (sharerType, sharerID) => {

    if(sharerType === 'user') {
        if(users) {
            let user = users.value.find(user => user.id === sharerID)
            return `${user.surname} ${user.name[0]}. ${user.middleName[0]}.`
        }
    } else {

        return `${sharerType}-${sharerID}`
    }
}