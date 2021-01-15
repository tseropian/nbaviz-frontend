<template>
  <header id="luxbar" class="luxbar-fixed">
    <input type="checkbox" class="luxbar-checkbox" id="luxbar-checkbox"/>
    <div class="luxbar-menu luxbar-menu-right luxbar-menu-light">
        <ul class="luxbar-navigation">
            <li class="luxbar-header">
                <a href="#" class="luxbar-brand">
                  Hoopcharts
                </a>
                <label class="luxbar-hamburger luxbar-hamburger-doublespin" 
                id="luxbar-hamburger" for="luxbar-checkbox"> <span></span> </label>
            </li>
            <li class="luxbar-item"><a href="/#/">Home</a></li>
            <li class="luxbar-item"><a href="/#/about">About</a></li>
            <li class="luxbar-item"><a href="/#/season">Rankings per season</a></li>
            <li class="luxbar-item"><a href="/#/contact">Contact</a></li>
        </ul>
    </div>
</header>
</template>
<style>
@import url("https://cdn.rawgit.com/balzss/luxbar/ae5835e2/build/luxbar.min.css");

</style>
<script>
    export default {
        mounted() {
        }
    }
</script>