<template>

  <div>
    <div class="flex-1 ...">
      <button 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
        @click="setConference('E')" 
        style="border:1px solid blue;"
      >
        Eastern Conference
      </button>
    </div>
    <div class="flex-1 ...">
      <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" @click="setConference('W')">Western Conference</button>
    </div>

    <div class="flex-1">
      <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 mr-4 border border-blue-500 hover:border-transparent rounded" @click="resetTeams();">
        Reset
      </button>
    </div>

    <div style="margin: 2em 0;">
      <button 
        v-for="team in filterTeams()" 
        :key="team.key" 
        @click="addTeam(team.key)" 
        class="py-2 px-4 mr-4 rounded text-white"  
        :class="{highlight:team.key == $store.getters.currentTeams}" 
        v-bind:style="{ 'background-color': team.colour }"
        
      >
        {{ team.key }}
      </button>
    </div>
  </div> 
</template>

<script>
export default {
  name: 'TeamSelection', 
  props:  ['teams', 'season'],
  data() {
    return {
      currentConference: ''
    }
  },
  methods: {
    setConference(conf) {
      this.currentConference = conf;
    },
    filterTeams() {
      return this.teams.filter(t => t.conference === this.currentConference);
    },
    addTeam(team) {
      // this.currentTeams = this.currentTeams + ',' + team;
console.log('Add Team')
      this.$store.commit('changeTeam', team)
      // this.currentTeams = team;
      // this.onChangeTeam();current
      // this.$router.push({ path: `/season/${this.season}/${team}` })     
      this.$emit('change-team', team)
    },
  }
}
</script>