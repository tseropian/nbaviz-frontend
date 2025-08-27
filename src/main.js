import { createApp } from 'vue'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createApolloProvider } from '@vue/apollo-option'
import VueApexCharts from 'vue3-apexcharts'

import router from './router'
import App from './App.vue'
import './assets/styles/index.css';
import { store } from './store/store'

import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

import VueGtag from 'vue-gtag-next';

const httpLink = createHttpLink({
  uri: process.env.VUE_APP_GRAPHQL_HOST,
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

const app = createApp(App)

Sentry.init({
  app,
  dsn: "https://180319df06ff47a99980c414f6b1cda4@o502152.ingest.sentry.io/5585809",
  integrations: [
    new BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});

app.provide(DefaultApolloClient, apolloClient)
app.use(apolloProvider)
app.use(store)
app.use(router)
app.use(VueApexCharts)
app.component('ApexChart', VueApexCharts)

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

app.use(VueGtag, {
  config: { id: "UA-187494834-1" }
}, router);

app.mount('#app')

