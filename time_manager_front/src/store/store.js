import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    loggingIn: false,
    token: localStorage.getItem('token') || '',
    loginError: null
  },
  mutations: {
    loginStart: state => state.loggingIn = true,
    loginStop: (state, errorMessage) => {
      state.loggingIn = false;
      state.loginError = errorMessage;
    },
    updateToken: (state, token) => {
      state.token = token;
    },
    logout: (state) => {
      state.token = null;
    }
  },
  actions: {

    login({commit}, user){
      commit('loginStart')
      axios({url: 'https://timepool.me:3001/api/users/sign_in', data: user, method: 'POST' })
      .then(resp => {
        localStorage.setItem('token', resp.data.token)
        commit('loginStop', null)
        commit('updateToken', resp.data.token)
        router.push('/d/dashboard')
      })
      .catch(err => {
        commit('loginStop', err.response.data.error)
        commit('updateToken', null)
      })  
    },

    fetchToken({ commit }) {
      commit('updateToken', localStorage.getItem('token'));
    },

    logout({commit}){
      localStorage.removeItem('token');
      commit('logout');
      router.push('/login');
    }

  },
  getters : {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  }
})