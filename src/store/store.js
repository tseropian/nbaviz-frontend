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
    rosterTenureData: null,
    rosterTenureSeason: null,
  },
  mutations: {
    changeSeason(state, season) {
      state.currentSeason = season
    },
    changeTeam(state, team) {
      state.currentTeams = team
    },
    storeAvailableTeams(state, teams) {
      state.availableTeams = teams
    },
    setRosterTenureData(state, payload) {
      state.rosterTenureData = payload
    },
    setRosterTenureSeason(state, year) {
      state.rosterTenureSeason = year
    },
  },
  getters: {
    currentSeason: (state) => state.currentSeason,
    availableTeams: (state) => state.availableTeams,
    currentTeams: (state) => state.currentTeams,
    rosterTenureData: (state) => state.rosterTenureData,
    rosterTenureSeason: (state) => state.rosterTenureSeason,
  },
})
