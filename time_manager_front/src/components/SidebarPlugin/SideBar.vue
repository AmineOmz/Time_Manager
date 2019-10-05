<template>
  <div
    class="sidebar"
    :data-color="activeColor"
    :data-image="backgroundImage"
    :style="sidebarStyle"
  >
    <div class="logo">
      <a href="#" class="simple-text logo-mini">
        <div class="logo-img">
          <img :src="imgLogo" alt="" />
        </div>
      </a>

      <a
        href="@/assets/img/logo.jpg"
        target="_blank"
        class="simple-text logo-normal"
      >
        {{ lastname }} {{ firstname }}
      </a>
    </div>
    <div class="sidebar-wrapper">
      <slot name="content"></slot>
      <md-list class="nav">
        <!--By default vue-router adds an active class to each route link. This way the links are colored when clicked-->
        <slot>
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :to="link.path"
            :link="link"
          >
          </sidebar-link>
        </slot>
      </md-list>
    </div>
  </div>
</template>
<script>
import SidebarLink from "./SidebarLink.vue";

import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default {

  data() {
    return {
       lastname: null,
      firstname: null
    }
  },
   created() {
    this.getInfo();
  },
  methods: {
      getInfo() {
      
      axios.get('https://timepool.me:3001/api/users/' + jwt_decode(localStorage.getItem('token')).id, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then((response) => {
          this.currentUser = response.data;
          this.firstname = this.currentUser.first_name;
          this.lastname = this.currentUser.last_name;
      })
      .catch((error) => {
          console.log(error);
      })
    }
  },

  components: {
    SidebarLink
  },
  props: {
    title: {
      type: String,
      default: "RED"
    },
    backgroundImage: {
      type: String,
      default: require("@/assets/img/back_side_2.png")
    },
    imgLogo: {
      type: String,
      default: require("@/assets/img/batman-2.png")
    },
    activeColor: {
      type: String,
      default: "",
      validator: value => {
        let acceptedValues = ["", "purple", "blue", "green", "orange", "red"];
        return acceptedValues.indexOf(value) !== -1;
      }
    },
    sidebarLinks: {
      type: Array,
      default: () => []
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      autoClose: this.autoClose
    };
  },
  computed: {
    sidebarStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`
      };
    }
  }
};
</script>
<style>
@media screen and (min-width: 991px) {
  .nav-mobile-menu {
    display: none;
  }
}
</style>
