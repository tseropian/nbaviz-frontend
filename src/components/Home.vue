<template>

  <div>
    

    <h1 class="text-4xl"><img alt="Vue logo" class="mx-auto w-20" src="../assets/basketball.png">Hoopcharts</h1>
    NBA Rankings per season
    <ul id="example-1">
      <li v-for="season in seasons" :key="season.year">
        <a :href="'/#/season/' + season.year">
          {{ season.year }}
        </a>
      </li>
</ul>  
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    seasons: gql`query{
      seasons {
        year
      }
    }`,
  },
}
</script>