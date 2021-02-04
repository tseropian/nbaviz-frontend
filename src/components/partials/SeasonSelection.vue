<template>
  <div>        
    Season: 
    <select class="form-control" v-model="$store.getters.currentSeason" @change="onChangeSeason">
      <option value="" selected disabled>Choose</option>
      <option  v-for="season in seasons" :value="season.year" :key="season.id">{{ season.year }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SeasonSelection', 
  props:  ['seasons'],
  methods: {
    async onChangeSeason() {
      // this.availableTeams = await this.fetchTeams(this.currentSeason);
      // // this.filterTeams();
      // // this.series = [];
      this.$router.push({ path: `/season/${event.target.value}` }) 
// alert('Ploplo')
      this.$store.commit('changeSeason', event.target.value)

    },
  }
}
</script>