<template>

  <div>
    NBA Rankings per season
    <ul id="example-1">
      <li v-for="season in seasons" :key="season.year">
        <a :href="'/season/' + season.year">
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