import Vue from 'vue'
import Router from 'vue-router'
import Season from '@/components/Season'
import Home from '@/components/Home'
import About from '@/components/About'
import Contact from '@/components/Contact'
import History from '@/components/History'
import HighLow from '@/components/HighLow'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Hoopcharts.xyz - Nerdy data visualisations about NBA', 
        metaTags: [
          {
            name: 'description',
            content: 'Hoopcharts.xyz is a nerdy datavisualisation website about the NBA.'
          },
          {
            property: 'og:description',
            content: 'Hoopcharts.xyz is a nerdy datavisualisation website about the NBA.'
          }
        ]
      }
    },
    {
      path: '/season/:year?/:team?',
      name: 'Season',
      component: Season,
      meta: {
        title: 'Hoopcharts.xyz - Regular Seasons Ranking per year', 
        metaTags: [
          {
            name: 'description',
            content: 'Hoopcharts.xyz - Regular Seasons Ranking per year'
          },
          {
            property: 'og:description',
            content: 'Hoopcharts.xyz - Regular Seasons Ranking per year'
          }
        ]
      }
    },
    {
      path: '/history/:team?',
      name: 'Rankings History',
      component: History,
      meta: {
        title: 'Hoopcharts.xyz - Rankings history per year', 
        metaTags: [
          {
            name: 'description',
            content: 'Hoopcharts.xyz - Regular Seasons Ranking per year'
          },
          {
            property: 'og:description',
            content: 'Hoopcharts.xyz - Regular Seasons Ranking per year'
          }
        ]
      }
    },
    {
      path: '/high-low',
      name: 'Highs and Lows per season',
      component: HighLow,
      meta: {
        title: 'Hoopcharts.xyz - High and Lows per Season', 
        metaTags: [
          {
            name: 'description',
            content: 'Hoopcharts.xyz - High and Lows per Season'
          },
          {
            property: 'og:description',
            content: 'Hoopcharts.xyz - High and Lows per Season'
          }
        ]
      }
    },    
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        title: 'About the website - Hoopcharts.xyz', 
        metaTags: [
          {
            name: 'description',
            content: 'Hoopcharts.xyz is a nerdy datavisualisation website about the NBA.'
          },
          {
            property: 'og:description',
            content: 'Hoopcharts.xyz is a nerdy datavisualisation website about the NBA.'
          }
        ]
      }
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
      meta: {
        title: 'Contact us - Hoopcharts.xyz', 
        metaTags: [
          {
            name: 'description',
            content: 'Hoopcharts.xyz is a nerdy datavisualisation website about the NBA.'
          },
          {
            property: 'og:description',
            content: 'Hoopcharts.xyz is a nerdy datavisualisation website about the NBA.'
          }
        ]
      }      
    },
  ]
})