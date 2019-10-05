<template>
  <!-- Material form register -->
  <div class="bg">
  <form @submit.prevent="register">
    <p class="h4 text-center mb-4">Sign up</p>
    <div class="h4 text-center mb-4">
      <mdb-input icon="user" type="text" placeholder="  Your First Name" v-model="first_name" required/>
      <mdb-input icon="user" type="text" placeholder="  Your Last Name" v-model="last_name" required/>
      <mdb-input  icon="envelope" type="email" placeholder="  Your email" v-model="email" required/>
      <mdb-input  icon="lock" type="password" placeholder=" Your password" v-model="password" required/>
      <mdb-input  icon="lock" type="password" placeholder=" Confirm Your password" v-model="confirm_password" required/>
    </div>
    <div class="text-center">
      <mdb-btn type="submit">Register</mdb-btn>
    </div>
      <div class="text-center">
      <mdb-btn><router-link to="/login">Login</router-link></mdb-btn>
    </div>
  </form>
  </div>
</template>

<script>
import { mdbInput, mdbBtn } from 'mdbvue';
import Swal from 'sweetalert2';
import axios from 'axios';

export default {

  name: 'Signup',

  data() {
    return {
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      confirm_password: null,
      user: {}
    }
  },

  created() {
    localStorage.removeItem('token');
  },

  components: {
    mdbInput,
    mdbBtn
  },

  methods: {

    register() {

      if (this.password !== this.confirm_password) {
        Swal.fire({
          title: 'Erreur',
          text: 'Les mots de passes ne sont pas identiques',
          type: 'error',
          confirmButtonText: 'Réessayez'
        });
      } else {
        axios.post('https://timepool.me:3001/api/users/sign_up', {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password
      })
      .then((response) => {
        Swal.fire(
          'Félicitation',
          'Vous êtes inscrit !',
          'success'
        );
        this.$router.push('/login');
      })
      .catch((error) => {
        Swal.fire({
          title: 'Erreur',
          text: 'Utilisateur existe déjà',
          type: 'error',
          confirmButtonText: 'Merci de réessayez'
        });
      });
      }
    }
}
  
};
</script>

 <style scoped>

.h4.text-center {
  margin: 0;
}
form {
  background: grey;
  padding: 1rem;
  border-radius: 20px;
}
.bg{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
background: url("~@/assets/img/Gotham_City.png");
background-repeat: no-repeat;
background-size: 100% 100%;
} 
</style>