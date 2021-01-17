<template>
  <div id="app">
        <div id="header">

    <Header></Header>
    </div>
    <div id="main">
    <router-view></router-view>


    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from './components/partials/Footer.vue'
import Header from './components/partials/Header'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@800&display=swap');

#app {
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
#main {
  min-height: 860px;
  padding: 2em 1em;
}

#header {
  height: 58px;
}

h1 {
  font-size: 2.5em;
  text-align: left;
  margin-bottom: 1.5em;
}

h2 {
  font-size: 1.8em;
  text-align: left;
  margin-top: 1.5em;
}


p {
  text-align: center;
}
</style>
