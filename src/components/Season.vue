<template>
  <div>
      <header></header>

      <h1>Regular Season Ranking: {{ currentSeason }}</h1>
      <div class="flex space-x-4 mt-5">
        <div class="flex-1 ...">

        Season: 
        <select v-model="currentSeason" class="form-control" @change="onChangeSeason($event)">
          <option value="" selected disabled>Choose</option>
          <option  v-for="season in seasons" :value="season.year" :key="season.id">{{ season.year }}</option>
        </select>
        </div>
        <div class="flex-1 ...">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="setConference('E')" style="border:1px solid blue;">Eastern Conference</button>
        </div>
        <div class="flex-1 ...">
          <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" @click="setConference('W')">Western Conference</button>
        </div>

        <div class="flex-1">
          <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" @click="resetTeams();">
            Reset
          </button>
        </div>
      </div>

      <div style="margin: 2em 0;">
      <button v-for="team in confTeams" :key="team.key" @click="onAddTeam(team.key)" class="border-solid	border-1 border-gray-900 py-2 px-4 rounded">
        {{ team.key }}
      </button>
      </div> 
      <div style="text-align: center; margin: 2em auto; border: 1px solid #2f363d; height: 400px; border-radius: 5px;">
        <apexchart type="line" :height='400' :options="options" :series="series"></apexchart>
      </div>

      <div style="margin-top: 2em; text-align: center; margin:0 auto;border: 1px solid #2f363d; border-radius: 5px;">
        Click on a team to see the rankings across the whole regular season.
      </div>
  </div>

</template>
<style>
  
</style>
<script>

import gql from 'graphql-tag'
import dateFormat from 'dateformat'

export default {
  name: 'Season',
  components: {
    
  },
  async created() {
    this.seasons = await this.fetchSeasons();
    this.teamRankings = [];
  },
  async mounted() {
    await this.buildSeason();
    await this.onChangeTeam();
  },
  data: () => ({
    seasons: [],
    currentSeason: 2019,
    currentTeams: '',
    currentConference: 'E',
    availableTeams: [],
    confTeams: [],
    teamRankings: ['qwqwq'],
    series: [],
    options: {
      chart: {
        id: 'vuechart-example',
        height: '100%',
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },

      title: {
        text: 'Regular Season Ranking (per Conference)',
        align: 'left'
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + 'ploplo '
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: -10
        }
      },
        stroke: {
          curve: 'smooth'
        },
      xaxis: {
        categories: [],

      },
      yaxis: {
        reversed: true,
        min: 1,
        max: 15,
        title: {
          text: 'Ranking'
        },
       
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    },        
  }),

  methods:{
    async buildSeason() {
      this.availableTeams = await this.fetchTeams(this.currentSeason);
    },

    async fetchSeasons() {
      const { data } = await this.$apollo.query({
        query: gql`query {
          seasons{
            year, startDate, endDate
          }
        }`
      });
      return data.seasons;
    },

    async fetchTeams() {
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
          year: Number(this.currentSeason)
        }  
      })
      .catch(err => console.log(err)); 

      return data.teams      
    },
    async fetchRankings(team) {
      console.log(this.currentSeason)
      const { data } = await this.$apollo.query({
        query: gql`
          query Rankings(
            $teams: String,
            $year: String,
          ) {
            rankings(
              season: $year, 
              teams: $teams
            ) {
              team, 
              position, 
              date, 
              wins, 
              losses
            }
          }`,
      variables: {
        teams: team,
        year: this.currentSeason.toString()
      }  
      }); 
      return data.rankings
    },
    buildSeries(allRankings) {

      const listTeams = this.currentTeams.split(',');
      let series = [];
      let labels = [];

      for (let team of listTeams) {
        if (team.length > 0) {
          const rankings = allRankings[team];        
          const data = rankings.map((s) => {
            const formattedDate = new Date(Number(s.date));          
            return {
              x: dateFormat(formattedDate, 'yyyy-mm-dd'), 
              y: s.position
            };
          });

          series.push({
            name: team,
            data
          });
        }
      }
      return {
        value: series, 
        labels
      };
    },
    async onChangeSeason() {
      this.availableTeams = await this.fetchTeams(this.currentSeason);
      this.filterTeams();
      this.series = [];

      // this.$route.params.year = this.currentSeason;

    },
    onAddTeam(team) {
      this.currentTeams = this.currentTeams + ',' + team;
      this.onChangeTeam();
    },
    async onChangeTeam() {
      const listTeams = this.currentTeams.split(',');
      let allRankings = [];
      
      for (let team of listTeams) {
        console.log(team)
        if (team.length > 0) {
          allRankings[team] = await this.fetchRankings(team);
        }
      }
      const {value} = this.buildSeries(allRankings);
      this.series = value; 
    },
    filterTeams() {
      this.confTeams =  this.availableTeams.filter(t => t.conference === this.currentConference);
   },
    setConference(conf) {
      this.currentConference = conf;
      this.filterTeams();
    },
    resetTeams() {
      this.currentTeams = '';
      this.series = [];
    }
  }
}
</script>




