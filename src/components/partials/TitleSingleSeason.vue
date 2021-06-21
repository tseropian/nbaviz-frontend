<template>
  <div>
    <h1>Season: {{ $store.getters.currentSeason }} {{ getFullTeam($store.getters.currentTeams) }}</h1>
  </div>
</template>
<script>
export default {
  methods: {
    getFullTeam(key) {
      console.log('KEY')
      console.log(key)
      console.log(this.$store.getters.availableTeams)
      if (key.length > 0 && this.$store.getters.availableTeams.length > 0) {
        const team = this.$store.getters.availableTeams.filter(t => t.key === key);
        const currentTeam = team[0]
        console.log(currentTeam)
        return ' - Team: ' + currentTeam.city + ' ' + currentTeam.name;
      }
      return '';
    }
  }
};
</script>



