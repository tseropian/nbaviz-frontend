<template>
  <div>
SEASON
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    teams: gql`query{
      teams {
        colour, key, name
      }
    }`,
  },
}
</script>