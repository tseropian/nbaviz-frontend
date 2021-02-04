<template>
  <div>
      <header/>

      <TitleSingleSeason />
      <div class="flex space-x-4 mt-5">
        <div class="flex-1 ...">
          <SeasonSelection :seasons="seasons" />
          <TeamSelection 
            :teams="$store.getters.availableTeams" 
            :season="$store.getters.currentSeason.toString()"
            @change-team="changeTeam"
          />

          {{ $store.getters.currentSeason }}
          <!-- {{ $store.getters.availableTeams }} -->
          {{ $store.getters.currentTeams }}
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
import SeasonSelection from './partials/SeasonSelection.vue'
import TitleSingleSeason from './partials/TitleSingleSeason.vue'

export default {
  name: 'Season',
  components: {
    TeamSelection,
    SeasonSelection,
    TitleSingleSeason
  },
  async created() {
    this.currentTeams = this.$route.params.team;
    const currentSeason = this.$route.params.year || this.currentSeason
    console.log('initial season ' + currentSeason)
    this.$store.commit('changeSeason', currentSeason)

    this.seasons = await this.fetchSeasons();
    this.teamRankings = [];
  },
  async mounted() {
    console.log('Just clicking')
    await this.buildSeason();
    // await this.onChangeTeam();
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

  methods: {
    async buildSeason() {
      console.log('Build Season')
      const teams = await this.fetchTeams();
      console.log("Teams");
      console.log(teams)
    this.$store.commit('storeAvailableTeams',  teams)

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
          year: Number(this.$store.getters.currentSeason)
        }  
      })
      .catch(err => console.log(err)); 

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
        year: this.$store.getters.currentSeason.toString()
      }  
      }); 
      return data.rankings
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
      // this.availableTeams = await this.fetchTeams(this.currentSeason);
      // this.filterTeams();
      // this.series = [];

      // this.$router.push({ path: `/season/${this.currentSeason}` }) 

    },
    async changeTeam() {
      const listTeams = this.$store.getters.currentTeams.split(',');
      let allRankings = [];
      
      for (let team of listTeams) {
        if (team.length > 0) {
          allRankings[team] = await this.fetchRankings(team);
        }
      }
      const {value} = this.buildSeries(allRankings);
      this.series = value; 
    },
    resetTeams() {
      this.currentTeams = '';
      this.series = [];
    },

  }
}
</script>




