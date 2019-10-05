<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
   

    <side-bar>
      <sidebar-link to="/d/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>

      <sidebar-link to="/d/user">
        <md-icon>person</md-icon>
        <p>User Profile</p>
      </sidebar-link>

      <sidebar-link to="/d/timemanager">
        <md-icon>content_paste</md-icon>
        <p>Time Manager</p>
      </sidebar-link>

       <sidebar-link v-if="admin || manager" to="/d/teammanager"> 
        <md-icon>assignment_ind</md-icon>
        <p>Team Manager</p>
      </sidebar-link>

      <sidebar-link v-if="admin || manager" to="/d/teamgraph">
        <md-icon>library_books</md-icon>
        <p>Team Graph</p>
      </sidebar-link>

      <sidebar-link v-if="admin || manager" to="/d/usergraph">
        <md-icon>bubble_chart</md-icon>
        <p>User Graph</p>
      </sidebar-link>

      <sidebar-link v-if="admin" to="/d/usermanager">
        <md-icon>supervisor_account</md-icon>
        <p>User Manager</p>
      </sidebar-link>

      <sidebar-link v-on:click="logout" to="/login">
        <md-icon>power_settings_new</md-icon>
        <p v-on:click="logout" >Déconnexion</p>
      </sidebar-link>

        <!-- <md-icon>power_settings_new</md-icon>
        <button v-on:click="logout">Déconnexion</button> -->
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content> </dashboard-content>

      
    </div>
  </div>
</template>

<script>

import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import { mapActions } from 'vuex';
import store from '@/store/store';
import jwt_decode from 'jwt-decode';


export default {

  name: 'DashboardLayout',
  data() {
    return {
      role: null,
      seen: true,
      admin: false,
      manager: false,
      user: false
    }
  },
  components: {
    TopNavbar,
    DashboardContent
  },
  created(){
    this.role = jwt_decode(localStorage.getItem('token')).role;

    if (this.role == 'Administrator') {
      this.admin = true;
      this.manager = false;
      this.user = false;
    } else if (this.role == 'Manager') {
      this.manager = true;
      this.admin = false;
      this.user = false;
    } else {
      this.user = true;
      this.admin = false;
      this.manager = false;
    }
  },

  methods: {
    ...mapActions(["logout"])
  }
};

</script>

<style lang="scss">

</style>