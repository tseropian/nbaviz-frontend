<template>
  <div>
    <h1>Season: {{ $store.getters.currentSeason }} {{ getFullTeam($store.getters.currentTeams) }}</h1>
  </div>
</template>
<script>
export default {
  methods: {
    getFullTeam(key) {
      if (key) {
        const [team] = this.$store.getters.availableTeams.filter(t => t.key === key);
        return ' - Team: ' + team.city + ' ' + team.name;
      }
      return '';
    }
  }
};
</script>



