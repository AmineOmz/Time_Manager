<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Editez votre profil</h4>
        <p class="category">Complétez votre profil</p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Prénom</label>
              <md-input v-model="firstname" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Nom</label>
              <md-input v-model="lastname" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>E-mail</label>
              <md-input v-model="email" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Mot de passe</label>
              <md-input v-model="password" type="password" required></md-input>
            </md-field>
          </div>
          <div></div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" v-on:click="edit">Mettre à jour</md-button>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" v-on:click="remove">Supprimer votre compte</md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>


<script>

import axios from 'axios';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import router from '../../router/index'

export default {

  name: "EditProfileForm",

  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      errors: [],
      currentUser: {},
      user: {},
      id: null,
      lastname: null,
      firstname: null,
      email: null,
      password: null,
      created_at: null,
      updated_at: null,
      confirm_password: null,
      canEdit: false,
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    
    fetchData() {
      
      axios.get('https://timepool.me:3001/api/users/' + jwt_decode(localStorage.getItem('token')).id, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then((response) => {
          this.currentUser = response.data;
          this.firstname = this.currentUser.first_name;
          this.lastname = this.currentUser.last_name;
          this.email = this.currentUser.email;
          this.password = this.currentUser.password;
          this.updated_at = this.currentUser.updatedAt;
          this.created_at = this.currentUser.createdAt;
      })
      .catch((error) => {
          console.log(error);
      })
    },

    edit() {

      if (this.password == null) {
        Swal.fire({
          type: 'error',
          title: 'Erreur',
          text: 'Veuillez saisir le mot de passe',
          footer: 'Merci de réessayez'
        });
        return;
      }

      if (this.password != null) {
        this.user.first_name = this.firstname;
        this.user.last_name = this.lastname;
        this.user.password = this.password;
        this.user.email = this.email;

        // ################## POST FOR GET JWT ###################
        axios.post('https://timepool.me:3001/api/users/sign_in', {email: this.email, password: this.password}, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then((response) => {
          if (response.data.token == null) {
            alert('Mot de passe incorrect');
            this.password = null;
            return;
          } else {
            axios.put('https://timepool.me:3001/api/users/' + jwt_decode(localStorage.getItem('token')).id, this.user, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')
            }
          })
          .then((response) => {
            Swal.fire(
              'Félicitation',
              'Profil mis à jour!',
              'success'
            );
            return;
          })
          .catch((e) => {
            Swal.fire({
              type: 'error',
              title: 'Erreur',
              text: 'Mise à jour du compte impossible',
              footer: 'Merci de réessayez'
            });
            console.log(e);
          })
          }
        })
        .catch((error) => {
          console.log(error);
        });
        // #################### END OF POST ######################
      }
        this.password = null;   
    },

    remove() {
      // CAS ADMIN
      var token = localStorage.getItem('token');

      if (jwt_decode(token).id == 1) {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Vous ne pouvez pas supprimer votre compte, vous êtes Administrateur!'
        })
        this.password = null;
        return;
      }

      if (jwt_decode(token).id != 1 && this.password == null) {
        Swal.fire({
          type: 'error',
          title: 'Erreur',
          text: 'Veuillez saisir le mot de passe',
          footer: 'Merci de réessayez'
        });
        return;
      }

      // ############### POST TO VERIFY IF EXISTS ################
      if (jwt_decode(token).id != 1 && this.password != null) {
        axios.post('https://timepool.me:3001/api/users/sign_in', {email: this.email, password: this.password}, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then((response) => {
          if (response.data.token == null) {
            this.password = null;
            return;
          } else {
            axios.delete('https://timepool.me:3001/api/users/' + jwt_decode(token).id, {
              headers: {
                Authorization: 'Bearer ' + token
              }
            })
            .then((resp) => {
              Swal.fire(
                'Supprimé',
                'Votre compte a bien été supprimé',
                'success'
              )
              localStorage.removeItem('token');
              router.push('/login');
            })
            .catch((err) => {
              console.log(err);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      }
    }
  }
}

</script>
