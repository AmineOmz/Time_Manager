<template>
  <div>
      <!-- AJOUT D'UNE EQUIPE QUE POUR L'ADMIN -->
      <h3 class="mt-3 text-center" v-if="admin">Ajouter une équipe</h3>
      <hr v-if="admin">
      <div class="row" v-if="admin">
            <div class="col">
                <p class="text-center">Nom de l'équipe</p>
                <input type="text" class="form-control" v-model="teamName" placeholder="Saisir le nom de l'équipe" required>
            </div>
            <div class="w-100"></div>
            <div class="col">
                <br>
                <p class="text-center">L'affecter à un manager</p>
                <select v-on:change="selectedValueManager($event)" id="listManagers" required>
                    <option>Choisissez un manager</option>
                    <option v-for="manager in managers" :key="manager.id" :value="manager.id" >{{ manager.first_name }} {{ manager.last_name }}</option>
                </select>
            </div>
      </div>
      <center><button class="btn btn-info mt-2" @click="addTeam" v-if="admin">Ajouter</button></center>
      <hr v-if="admin">
      <!-- FIN DE L'AJOUT D'UNE EQUIPE QUI CONCERNE L'ADMIN -->

      <table class="table table-striped table-hover table-responsive" style="widht: auto;">
        <thead>
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
            <tr v-for="employee in employees" :key="employee.id">
                <td>{{ employee.id }}</td>
                <td>{{ employee.last_name }}</td>
                <td>{{ employee.first_name }}</td>
                <td>{{ employee.email }}</td>
                <td>{{ employee.role }}</td>
                <td>
                    <button v-on:click="addToTeam(employee.id)">Ajouter à</button> | 
                    <button v-on:click="removeFromTeam(employee.id)">Supprimer de </button> |
                    <select v-on:change="selectedValueTeam($event)"> 
                        <option>Choisissez une équipe</option>
                        <option v-for="team in teams" :key="team.id" :value="team.id" >{{ team.name }}</option>
                    </select>
                </td>
            </tr>
        </tbody>
      </table>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";

export default {
  name: "TeamManager",

  data() {
    return {
      // FOR ROLES
      admin: false,
      manager: false,

      // FOR ADMIN
      managers: [],
      teams: [],
      managerId: null,

      // FOR MANAGER
      myTeams: [],

      // FOR ALL
      users: [],
      employees: [],
      teamName: null,
      teamId: null,
      members: [],
      exists: false,

      
    };
  },

  created() {
    this.checkRole();
    this.getEmployeesAndManagers();
    this.getTeams();
  },

  methods: {

    checkRole() {
      if (jwt_decode(localStorage.getItem("token")).role == "Administrator") {
        this.admin = true;
        this.manager = false;
      } else if (jwt_decode(localStorage.getItem("token")).role == "Manager") {
        this.admin = false;
        this.manager = true;
      } else {
        this.admin = false;
        this.manager = false;
      }
    },

    getTeams() {
        axios.get('https://timepool.me:3001/api/teams', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then((response) => {
            this.teams = response.data;

            // CASE MANAGER
            for (var i = 0; i < this.teams.length; i++) {
                if (this.teams[i].managerId == jwt_decode(localStorage.getItem('token')).id) {
                    this.myTeams.push(this.teams[i]);
                }
            }

            if (this.manager) {
                this.teams = this.myTeams;
            }
        })
        .catch((error) => {
            console.log(error);
        });
    },

    getEmployeesAndManagers() {
        axios.get('https://timepool.me:3001/api/users', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then((response) => {
            this.users = response.data;
            this.users.splice(0, 1);

            // GET ONLY MANAGERS
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].role == 'Manager') {
                    this.managers.push(this.users[i]);
                }
            }

            // GET ONLY EMPLOYEES
            for (var j = 0; j < this.users.length; j++) {
                if (this.users[j].role == 'Employee') {
                    this.employees.push(this.users[j]);
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
    },

    selectedValueManager(e) {
        console.log(e.target.value);
        this.managerId = e.target.value;
    },

    selectedValueTeam(e) {
        this.teamId = e.target.value;
    },

    addTeam() {
        if (this.teamName != null && this.managerId != null) {
            axios.post('https://timepool.me:3001/api/teams', {name: this.teamName, managerId: this.managerId}, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                Swal.fire(
                    'Félicitation!',
                    'Equipe ajoutée avec succès',
                    'success'
                )
            })
            .catch((error) => {
                console.log(error);
            });
        } else if (this.teamName == "" || this.teamName == null && this.managerId == null){
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: "Erreur: nom de l'équipe ou manager non renseigné",
                footer: 'Merci de réessayez</a>'
            })
        }
    },

    addToTeam(id) {
        if (this.teamId == null) {
            alert('Aucune équipe choisie');
        } else {

            // AVOIR LES EQUIPES A LAQUELLE APPARTIENT L EMPLOYE CHOISI
            axios.get('https://timepool.me:3001/api/teamscontent/user/' + id, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                this.members = response.data;
                for (var i = 0; i < this.members.length; i++) {
                    if (this.members[i].teamId == this.teamId) {
                        this.exists = true;
                        break;
                    }
                }

            if (!this.exists) {
                axios.post('https://timepool.me:3001/api/teamscontent', {teamId: this.teamId, employeeId: id}, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(r => {
                    Swal.fire(
                        'Félicitation!',
                        'Employé ajouté avec succès',
                        'success'
                    )
                })
                .catch(e => {
                    Swal.fire({
                        type: 'error',
                        title: 'Erreur',
                        text: "Erreur lors de l'ajout",
                        footer: 'Merci de réessayez'
                    })
                });
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Erreur: cet employé existe déjà dans cette équipe'
                })
            }
                
            })
            .catch((error) => {
                console.log(error);
            });
        }

        this.members = [];
        this.exists = false;
    },

    removeFromTeam(id){
        if (this.teamId == null) {
            alert('Aucune équipe choisie');
        } else {
            // AVOIR LES EQUIPES A LAQUELLE APPARTIENT L EMPLOYE CHOISI
            axios.get('https://timepool.me:3001/api/teamscontent/user/' + id, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                this.members = response.data;
                for (var i = 0; i < this.members.length; i++) {
                    if (this.members[i].teamId == this.teamId) {
                        this.exists = true;
                        break;
                    }
                }

            if (this.exists) {
                axios.delete('https://timepool.me:3001/api/teamscontent/team/' + this.teamId + '/user/' + id, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(r => {
                    Swal.fire(
                        'Félicitation!',
                        "Employé supprimé de l'équipe avec succès",
                        'success'
                    )
                })
                .catch(e => {
                    Swal.fire({
                        type: 'error',
                        title: 'Erreur',
                        text: "Erreur lors de la suppression",
                        footer: 'Merci de réessayez'
                    })
                });
            } else {
                Swal.fire({
                        type: 'error',
                        title: 'Erreur',
                        text: "Cet employé n'existe même pas dans cette équipe",
                        footer: 'Merci de réessayez'
                })
            }
                
            })
            .catch((error) => {
                console.log(error);
            });
        }

        this.members = [];
        this.exists = false;
    }
  }
}
</script>

<style>
#listManagers {
  width: 40%;
  display: block;
  margin: 0 auto;
}

#listTeams {
    width: 40px;
}
</style>
