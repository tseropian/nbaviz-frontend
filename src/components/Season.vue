<template>
  <div>
    SEASON {{ $route.params.year }}
 
    <input v-model="currentTeams" placeholder="edit me" @change="onChangeTeam($event)">
    {{ currentTeams }}

    <template>
      <div>
        <apexchart width="1440" type="line" :options="options" :series="series"></apexchart>
      </div>
    </template>
{{ availableTeams.length }}
<!-- {{ teams }} -->
        <span v-for="team in availableTeams" :key="team.key">
          {{ team.key }}
        </span>
  </div>

</template>

<script>

import gql from 'graphql-tag'
import dateFormat from 'dateformat'

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
    currentTeams: 'SEA',
    availableTeams: [],
    teamRankings: ['qwqwq'],
    series: [],
    options: {
      chart: {
        id: 'vuechart-example',
        height: 200,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
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
          sizeOffset: 6
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
      console.log('Lets go')
      console.log('Ranking for teams: ' + this.currentTeams)
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
              colour
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

    async onChangeTeam() {
      const listTeams = this.currentTeams.split(',');
      let allRankings = [];
      
      for (let team of listTeams) {
        allRankings[team] = await this.fetchRankings(team);
      }

      const {value} = this.buildSeries(allRankings);
      this.series = value; 
    }
  }
}
</script>




