<template>
  <router-view></router-view>
</template>

<script>
import store from "@/store/store"
export default {

  name: 'app',
  updated(){
    if (!store.state.token)
      {
        if (this.$router.history.current.path != "/login" && this.$router.history.current.path != "/signup")
          this.$router.push('/login')
      }
  }
};
</script>

<style>

</style>
