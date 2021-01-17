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

import VueGtag from 'vue-gtag';

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

// Link: https://www.digitalocean.com/community/tutorials/vuejs-vue-router-modify-head
// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title
  } else { 
    document.title = previousNearestWithMeta.meta.title
  }
  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create, so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
  .forEach(tag => document.head.appendChild(tag));

  next();
});

Vue.use(VueGtag, {
  config: { id: "UA-187494834-1" }
}, router);

new Vue({
  el: '#app',
  apolloProvider,
  router,
  render: h => h(App),
})

