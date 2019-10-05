import Router from 'vue-router';
import Vue from 'vue';

// IMPORT COMPONENTS
import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TimeManager from "@/pages/TimeManager.vue";
import TeamManager from "@/pages/TeamManager.vue";
import TeamGraph from "@/pages/TeamGraph.vue";
import UserGraph from "@/pages/UserGraph.vue";
import UserManager from "@/pages/UserManager.vue";
import Dashboard from '@/pages/Dashboard.vue';
import store from "@/store/store.js";

import Login from "@/components/Authentication/Login.vue";
import SignUp from "@/components/Authentication/SignUp.vue";

Vue.use(Router);

const router = new Router({

  mode: 'history',
  base: process.env.BASE_URL,
  routes : [
 
    {
      path: '*',
      redirect: '/login'
    },
    {
     path: "/login",
     name: "Login",
     component: Login
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp
     },
    {
      path: "/d/",
      component: DashboardLayout,
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard
        },
        {
          path: "user",
          name: "User Profile",
          component: UserProfile
        },
        {
          path: "timemanager",
          name: "Time Manager",
          component: TimeManager
        },
        {
          path: "teammanager",
          name: "Team Manager",
          component: TeamManager
        },
        {
          path: "teamgraph",
          name: "Team Graph",
          component: TeamGraph
        },
        {
          path: "usergraph",
          name: "User Graph",
          component: UserGraph
        },
        {
          path: "usermanager",
          name: "User Manager",
          component: UserManager
        }
  
      ]
    }
  ]
});


router.beforeEach((to, from, next) => {
  store.dispatch('fetchToken');
  if (to.fullPath != '/login' && to.fullPath != "/signup") {
    if (store.state.token == null) {
      next('/login');
    }
  }
  if (to.fullPath === '/login') {
    if (store.state.token) {
      next('/d/dashboard');
    }
  }
  next();
});

export default router;


