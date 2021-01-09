<template>
  <div>
    SEASON: {{ $route.params.year }}
    <br />
    TEAMS: {{ currentTeams }}

    <template>
      <div style="margin:auto 0; padding-left: 100px; height: 500px;border:1px solid red;">
        <apexchart type="line" width="800" :options="options" :series="series"></apexchart>
      </div>
    </template>
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="setConference('E')" style="border:1px solid blue;">Eastern Conference</button>
<br /><br />
<button class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="setConference('W')">Western Conference</button>
<!-- {{ teams }} -->
<br /><br />

<button v-for="team in confTeams" :key="team.key" @click="onAddTeam(team.key)" class="border-solid	border-1 border-gray-900 py-2 px-4 rounded">
  {{ team.key }}
</button>
<br /><br />

<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="resetTeams();">
  Reset
</button>

  </div>

</template>

<script>

import gql from 'graphql-tag'
import dateFormat from 'dateformat'
import '../assets/styles/index.css';

export default {
  name: 'Season',
  created() {
    this.buildSeason();
    this.teamRankings = [];

  },
  async mounted() {
    console.log('I have been mounted')
    this.onChangeTeam();

  },
  data: () => ({
    currentSeason: 0,
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
  apollo: {
    seasons: {
      query: gql`query Year($year: String!) {
        seasons(year: $year){
          year, startDate, endDate
        }
      }`,
      variables () {
        return {
            year: this.$route.params.year
        }
      },
    },   
  },
  methods:{
    async buildSeason() {
      console.log('PPPP', this.$route.params.team)
      console.log('Lets go')
      console.log('Ranking for teams: ' + this.currentTeams)
      this.currentTeams = this.$route.params.team || 'SEA'
      this.currentSeason = this.$route.params.year;
      this.availableTeams = await this.fetchTeams(this.currentSeason);
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
      console.log(data)
      return data.teams      
    },
    async fetchRankings(team) {
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
        year: this.currentSeason
      }  
      }); 
      return data.rankings
    },
    buildSeries(allRankings) {

      const listTeams = this.currentTeams.split(',');
      let series = [];
      let labels = [];

      for (let team of listTeams) {
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
      return {value: series, labels};
    },
    onAddTeam(team) {
      this.currentTeams = this.currentTeams + ',' + team;
      this.onChangeTeam();
    },
    async onChangeTeam() {
      const listTeams = this.currentTeams.split(',');
      let allRankings = [];
      
      for (let team of listTeams) {
        allRankings[team] = await this.fetchRankings(team);
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
    }
  }
}
</script>




