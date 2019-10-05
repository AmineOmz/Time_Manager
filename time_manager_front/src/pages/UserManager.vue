<template>
    <div>
        <table class="table table-striped table-hover table-reponsive">
            <thead class="thead-dark">
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Nom</th>
                <th scope="col">Prénom</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="{id, last_name, first_name, email, role} in users" :key="id">
                <td><b>{{ id }}</b></td>
                <td><b>{{ last_name }}</b></td>
                <td><b>{{ first_name }}</b></td>
                <td><b>{{ email }}</b></td>
                <td><b>{{ role }}</b></td>
                <td><button v-on:click="promote(id, first_name, role)">Promouvoir</button> | <button v-on:click="deleting(id)">Supprimer</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'UserManager',

    data() {
        return {
            users: [],
            managers: [],
            token: localStorage.getItem('token'),
            teamName: '',
            selected: null,
            managerId: null,
            team: {
                name: '',
                managerId: 0
            }
        }
    },

    created() {
        this.getUsersAndManagers();
    },

    methods: {

        selectedValue(e) {
            this.managerId = e.target.value;
        },

        getUsersAndManagers() {
            axios.get('https://timepool.me:3001/api/users', {headers: {
                Authorization: 'Bearer ' + this.token
            }}).then((response) => {
                // RETRIEVE USERS
                this.users = response.data;
                this.users.splice(0, 1);
                this.total = this.users.length;

                // RETRIEVE MANAGERS
                for (var i = 0; i < this.users.length; i++) {
                    if (this.users[i].role == 'Manager') {
                        this.managers.push(this.users[i]);
                    }
                }
            }).catch((error) => {
                console.log(error);
            });
        },

        deleting(id) {
            Swal.fire({
                title: 'Êtes vous sûr de vouloir supprimer cet utilisateur ?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui supprimer'
                }).then((result) => {
                if (result.value) {
                    axios.delete('https://timepool.me:3001/api/users/' + id, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.getUsers();
                        Swal.fire(
                            'Supprimé!',
                            'success'
                        )
                    }).catch(err => {
                        Swal.fire({
                            type: 'error',
                            title: 'Erreur',
                            text: 'Suppression impossible'
                        })
                        console.log(err);
                    });
                }
            })
        },

        promote(id, first_name, role) {
            if (role == 'Manager') {
                Swal.fire({
                    type: 'error',
                    title: 'Erreur',
                    text: first_name + ' est déjà Manager'
                });
            } else {
                axios.patch('https://timepool.me:3001/api/users/' + id, {role: 'Manager'}, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }   
                })
                .then((response) => {
                    this.getUsersAndManagers();
                    Swal.fire(
                        'Félicitation!',
                        first_name + ' est devenu(e) Manager',
                        'success'
                    )
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            
        },
    }
}
</script>
