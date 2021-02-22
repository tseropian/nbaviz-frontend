import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
    },
    changeTeam(state, team) {
      state.currentTeams = team
    },
    storeAvailableTeams(state, teams) {
      state.availableTeams = teams;
    }
    
  },
  getters: {
    currentSeason: state => state.currentSeason,
    availableTeams: state => state.availableTeams,
    currentTeams: state => state.currentTeams,
  }
})
