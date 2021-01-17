<template>

  <div id="about"> 
    <img alt="Vue logo" class="mx-auto w-40" src="../assets/basketball.png">

    <h1 class="text-4xl">About Hoopcharts</h1>
    <p>Hoopcharts has been launched in January 2021 by a software engineer who had too much free time between two work contracts during Covid-19. I wanted to start tinkering 
      with frontend programming, data visualisation and NBA Analytics :-)</p>
    
    <p>Follow our updates on social media for the upcoming features.</p>

    <p>Hoopcharts is run by Thomas, who grew up as a teenager in the 90s, watching NBA games on VHS. He is the New York Knicks, San Antonio Spurs and the Seattle SuperSonics.</p> 
    
    <h2>Updates</h2>
    <ul>
      <li>- 2021-01-16: Fixed a bunch of bugs</li>
      <li>- 2021-01-06: Hoopcharts goes online with sample data from regular seasons 2018 to 2020</li>
    </ul>
  </div>
</template>

<style>
#about {
  text-align: left;
}

#about p {
  text-align: left;
  margin: 1em 0;
}

</style>
<script>

import '../assets/styles/index.css';

export default {
  name: 'About'
}
  </script>