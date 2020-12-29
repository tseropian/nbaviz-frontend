import Vue from 'vue'
import App from './App.vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: 'http://localhost:4000/graphql'
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.use(VueApollo)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  // inject apolloProvider here like vue-router or vuex
  apolloProvider,
  render: h => h(App),
})