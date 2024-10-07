const { users } = storeToRefs(useUsersStore());
const { organizations } = storeToRefs(useOrganizationsStore())

export const translateSharersInProject = (sharerType, sharerID) => {

    // USER
    if(sharerType === 'user') {
        if(users.value) {
            let user = users.value.find(user => user.id === sharerID)
            return `${user.surname} ${user.name[0]}. ${user.middleName[0]}.`
        }
    } 
    // COMPANY
    else if(sharerType == 'company'){
        if(organizations.value) {
            let company = organizations.value.find(company => company.id === sharerID)
            return `${company.title}`
        }
    } 
    // ПРОЧЕЕ
    else {
        return `${sharerType}-${sharerID}`
    }
}