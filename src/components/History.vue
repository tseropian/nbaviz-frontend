<template>
  <div>
      <header/>

      <div>
        <h1>History Ranking for {{ $store.getters.currentTeams }}</h1>
      </div>
      <div class="flex space-x-4 mt-5">        
        <div class="flex-auto w-4/5">

          <TeamSelection 
            :teams="$store.getters.availableTeams" 
            :season="$store.getters.currentSeason.toString()"
            @change-team="changeTeam"
          />

        </div>
      </div>
      <div style="text-align: center; margin: 2em auto; border: 1px solid #2f363d; height: 400px; border-radius: 5px;">
        <apexchart type="line" :height='400' :options="options" :series="series" ></apexchart>
      </div>

      <div style="margin-top: 2em; padding: 2em; text-align: center; margin:0 auto;border: 1px solid #2f363d; border-radius: 5px;">
        Click on a team to see the rankings across the whole regular season.
        <p style="text-align:left;margin-top: 2em;">
          NB: This website is still in beta mode. There may be some inaccuracies with some of the ranking (especially with tie-breakers). On top of that, my initial data set also contains some discrepancies I plan to review and update soon. 
          <a href="/#/contact">Feel free to reach out</a> if you have any comment or if you want to receive updates on future releases.        
      </p>
      </div>
  </div>

</template>
<style>
  .highlight{ 
    border: 2px solid black;
  }
</style>
<script>
import gql from 'graphql-tag'
import dateFormat from 'dateformat'

import TeamSelection from './partials/TeamSelection.vue'
// import TitleSingleSeason from './partials/TitleSingleSeason.vue'

export default {
  name: 'Season',
  components: {
    TeamSelection
  },
  async created() {
    const currentTeams = this.$route.params.team || 'SAS';
    const availableTeams = await this.fetchTeams('2020');
    this.$store.commit('storeAvailableTeams', availableTeams)
    this.$store.commit('changeTeam', currentTeams)

    // this.seasons = await this.fetchSeasons();
  },
  async mounted() {
    // await this.buildSeason();
    const currentTeams = this.$route.params.team || 'SAS';
    this.$store.commit('changeTeam', currentTeams)
    await this.changeTeam();
  },
  data: () => ({
    seasons: [],
    availableTeams: [],
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

  methods: {

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
          year: Number(this.$store.getters.currentSeason)
        }  
      })
      .catch(err => console.log(err)); 

      return data.teams      
    },

    async fetchRankings(team) {
      const { data } = await this.$apollo.query({
        query: gql`
          query SeasonRankings(
            $teams: String,            
          ) {
            seasonRankings(
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
          year: this.$store.getters.currentSeason.toString()
        }  
      }); 
      return data.seasonRankings
    },

    buildSeries(allRankings) {

      const listTeams = this.$store.getters.currentTeams.split(',');
      let series = [];
      let labels = [];

      for (let team of listTeams) {
        if (team.length > 0) {
          const rankings = allRankings[team];        
          const data = rankings.map((s) => {
            const formattedDate = new Date(Number(s.date));          
            return {
              x: dateFormat(formattedDate, 'yyyy'), 
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
    async changeSeason() {
      const availableTeams = await this.fetchTeams(this.$store.getters.currentSeason);
      this.$store.commit('storeAvailableTeams', availableTeams)
    },
    async changeTeam(e) {
      const listTeams = this.$store.getters.currentTeams.split(',');
      let allRankings = [];
      
      for (let team of listTeams) {
        if (team.length > 0) {
          allRankings[team] = await this.fetchRankings(team);
        }
      }

      const {value} = this.buildSeries(allRankings);
      this.series = value; 
      // this.$router.push({ path: `/history//${this.season}/${team}` })     

    },

    resetTeams() {
      this.currentTeams = '';
      this.series = [];
    },

  }
}
</script>




