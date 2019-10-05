<template >
<div class="bg">
  <form class="form-signin" @submit.prevent="login">
    <p class="h4 text-center">Sign in</p>
    <div class="h4 text-center mb-4">
      <mdb-input icon="envelope" v-model="email" type="email" placeholder="  Email" required/>
      <mdb-input icon="lock" v-model="password" type="password" placeholder="  Password" required/>
    </div>
    <div class="text-center">
      
        <mdb-btn type='submit'>Connect</mdb-btn>
      
    </div>
    <div class="text-center">
      <router-link to="/signup">
        <mdb-btn>Sign Up</mdb-btn>
      </router-link>
    </div>
  </form>
  </div>
</template>

<script>

import { mdbInput, mdbBtn } from "mdbvue";
import axios from 'axios';
import Swal from 'sweetalert2';

export default {

  name: "Login",

  components: {
    mdbInput,
    mdbBtn
  },

  data () {

    return {
      email: '',
      password: '',
      token: '',
      users: [],
      errors: []
    }
    
  },

  created() {
    localStorage.removeItem('token');
  },

  methods: {

    login() {
      axios.post('https://timepool.me:3001/api/users/sign_in', {email: this.email, password: this.password})
      .then((token) => {
        localStorage.setItem('token', token.data.token);
        this.$router.push('/d/dashboard');
      })
      .catch((error) => {
        Swal.fire({
          type: 'error',
          title: 'Erreur',
          text: 'Email ou mot de passe incorrect(s)',
          footer: 'Veuillez saisir les bons identifiants'
        });
      });
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
 