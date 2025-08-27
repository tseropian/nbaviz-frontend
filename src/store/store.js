import { createStore } from 'vuex'

export const store = createStore({
  state: {
    currentTeam: '',
    seasons: [],
    currentSeason: 2023,
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
