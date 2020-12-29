import Vue from 'vue'
import Router from 'vue-router'
import Season from '@/components/Season'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/season/:year',
      name: 'Season',
      component: Season
    },
  ]
})