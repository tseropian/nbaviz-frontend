<template>
  <div>        
    Season: 
    <select class="form-control" v-model="currentSeason" @change="onChangeSeason">
      <option value="" selected disabled>Choose</option>
      <option  v-for="season in seasons" :value="season.year" :key="season.id">{{ season.year }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SeasonSelection', 
  props:  ['seasons'],
  data() {
    return {
      currentSeason: ''
    }
  },
  mounted() {
    this.currentSeason = this.$store.getters.currentSeason
  },
  methods: {
    async onChangeSeason() {
      this.$router.push({ path: `/season/${event.target.value}` }) 
      this.$store.commit('changeSeason', event.target.value)
      this.$emit('change-season', event.target.value)

    },
  }
}
</script>