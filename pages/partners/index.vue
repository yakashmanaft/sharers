
<template>
    <!-- https://www.youtube.com/watch?v=3MPlTDgQaaE -->
    <div>

      <div>
        
        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Edit user</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <input v-model="editedUser.name" type="text" class="form-control" id="exampleInputName1" aria-describedby="nameHelp"> 
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="editUser(editedUser)">Save changes</button>
              </div>
            </div>
          </div>
        </div>
  
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> Delete Error
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-lebel="Close" @click="error = null"></button>
        </div>
  
  
        <Container>
          <h1>Соучастники</h1>
          <form>
            <div class="mb-3">
              <label for="exampleInputName1" class="form-label">Name</label>
              <input v-model="user.name" type="text" class="form-control" id="exampleInputName1" aria-describedby="nameHelp">  
            </div>
            <div class="mb-3">
              <label for="exampleInputName1" class="form-label">Role</label>
              <input v-model="user.role" type="text" class="form-control" id="exampleInputName1" aria-describedby="nameHelp">  
            </div>
            <button type="submit" class="btn btn-primary" @click.prevent="addUser(user)">Add Name</button>
          </form>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td @click="$router.push(`/partners/${user.id}`)">
                  {{user.name}} | {{ user.role }}
                </td>
                <td>      
                  <!-- Button trigger modal -->
                  <button 
                    type="button" 
                    class="btn btn-warning" 
                    data-bs-toggle="modal" 
                    data-bs-target="#exampleModal"
                    @click="{ editedUser.id = user.id; editedUser.name = user.name}"
                  >
                    Edit
                  </button>
                </td>
                <td><button type="button" class="btn btn-danger btn-sm" @click = deleteUser(user.id)>Delete</button></td>
              </tr>
            </tbody>
          </table>
        </Container>
      </div>
    </div>
</template>

<script setup>

import {Container} from '@/shared/container'

import {H3Error} from 'h3'
import { v4 as uuidv4 } from 'uuid'

const users = ref(null)
const user = ref({
  uuid: null,
  email: 'anfalov@camini-pk.ru',
  password: 'Anfalov123[eq',
  name: null,
  role: 'USER'
})

const error = ref(null)
const editedUser = ref({
  id: 0,
  uuid: null,
  email: null,
  password: null,
  name: null,
  role: null
})
onMounted(async () => {

  users.value = await getUsers()

})

/** 
 * @desc Get users
*/
async function getUsers() {
    return await $fetch('api/users')
}

/** 
 * @desc Add user
 * @param user The user to add
*/
async function addUser(user) {
  let addedUser = null

  if(user)
    addedUser =  await $fetch('api/users', {
      method: 'POST',
      body: {
        uuid: uuidv4(),
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role
      }
    })

    
    if(addedUser) users.value = await getUsers()
}

/** 
 * @desc Delete users
*/
async function deleteUser(id) {
  let deletedUserOrError = null
  // id = 'aoaoaoao'

  if(id)
    deletedUserOrError = await $fetch('api/users', {
      method: 'DELETE',
      body: {
        id: id
      }
    })

  if(deletedUserOrError instanceof H3Error) {
    error.value = deletedUserOrError
    console.log('error: ', error)
    return 
  } 

  users.value = await getUsers()
}

/** 
 * @desc Edit user
 * @param user The user to add
*/
async function editUser(editedUser) {
  let user = null

  if(editedUser.id && editedUser.name)
    user =  await $fetch('api/users', {
      method: 'PUT',
      body: {
        id: editedUser.id,
        name: editedUser.name
      }
    })

    
    if(user) users.value = await getUsers()
}

useHead({
        title: "Соучастники",
        link: [
            { 
                rel: 'stylesheet', 
                href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
                integrity: "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",
                crossorigin: "anonymous",
                type: "text/css"
            }
        ],
        script: [
            {
                src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
                integrity: "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",
                crossorigin: "anonymous",
            }
        ]
    })
</script>