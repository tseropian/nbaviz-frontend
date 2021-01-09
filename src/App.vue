<template>
  <div id="app">
    <Push>
      <a id="home" href="#">
        <span>Home</span>
      </a>
      <a id="home" href="/#/about">
        <span>About</span>
      </a>
      <a id="home" href="#">
        <span>Twitter</span>
      </a>
      <a id="home" href="/#/contact">
        <span>Contact</span>
      </a>
    </Push>
    <router-view></router-view>
  </div>
</template>

<script>
import { Push } from 'vue-burger-menu' 

export default {
  name: 'App',
      components: {
        Push // Register your component
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
  margin-top: 60px;
}
</style>
