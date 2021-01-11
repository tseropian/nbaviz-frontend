import Vue from 'vue'
import VueRouter from 'vue-router'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'
import VueApexCharts from 'vue-apexcharts'

import router from './router'
import App from './App.vue'
import './assets/styles/index.css';

import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  Vue,
  dsn: "https://180319df06ff47a99980c414f6b1cda4@o502152.ingest.sentry.io/5585809",
  autoSessionTracking: true,
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_GRAPHQL_HOST
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.use(VueRouter)
Vue.use(VueApollo)
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  // inject apolloProvider here like vue-router or vuex
  apolloProvider,
  router,
  render: h => h(App),
})