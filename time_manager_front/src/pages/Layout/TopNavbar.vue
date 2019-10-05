<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ $route.name }}</h3>
      </div>
      <div class="md-toolbar-section-end">
           <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          
        </md-button>
        <div class="md-collapse">
        <!-- <md-list>
            <md-list-item href="/dash/login">
              <i class="material-icons">power_settings_new</i>
            </md-list-item>
          </md-list> -->
          <router-link  to="/login">
          <i v-on:click="logout" class="material-icons">power_settings_new</i>
          </router-link>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>

import { mapActions } from 'vuex';

export default {
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    ...mapActions(["logout"])
  }
};
</script>

<style lang="css"></style>
