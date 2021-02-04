import Vue from 'vue'
import Vuex from 'vuex'
import gql from 'graphql-tag'

Vue.use(Vuex)


const fetchTeams = async (season) => {
  console.log('Fetching teams for season ' + this.$store.getters.currentSeason)
  const { data } = await this.$apollo.query({
    query: gql`
      query Team(
        $year: Int,
      ) {
        teams(
          year: $year
        ) {
          key,
          city, 
          name, 
          colour,
          conference
        }
      }`,
    variables: {
      year: Number(season)
    }  
  })
  .catch(err => console.log(err)); 

  return data.teams      
}

export const store = new Vuex.Store({
  state: {
    currentTeam: '',
    seasons: [],
    currentSeason: 2019,
    currentTeams: '',
    currentConference: 'E',
    availableTeams: [],
    confTeams: [],
    teamRankings: ['qwqwq'],
  },
  mutations: {
    changeSeason(state, season) {
      state.currentSeason = season
      this.fetchTeams = fetchTeams(season);
    },
    changeTeam(state, team) {
      state.currentTeams = team
    },
    storeAvailableTeams(state, teams) {
      // teams.forEach(t => {
      //   console.log(t.key)
      // })
      state.availableTeams = teams;
    }
    
  },
  getters: {
    currentSeason: state => state.currentSeason,
    availableTeams: state => state.availableTeams,
    currentTeams: state => state.currentTeams,
  }
})
