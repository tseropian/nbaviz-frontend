<template>
  <div>
      <header/>

      <!-- <TitleSingleSeason /> -->
      <div class="flex space-x-4 mt-5">        
        <div class="flex-auto w-4/5">



        </div>
      </div>
      <div style="text-align: center; margin: 2em auto; border: 1px solid #2f363d; border-radius: 5px;">

        <ul id="example-1">
          <table>
          <tr>
            <td>
              Season
            </td>
            <td>
              Highest progression
            </td>
            <td>
              Teams
            </td>
            <td>
              Biggest drop
            </td>
            <td>
              Teams
            </td>
          </tr>
          <tr v-for="hl in highLows" :key="hl.year">
            <td>
              {{ hl.year  }}
            </td>
            <td>
              {{ hl.highDelta }}
            </td>
            <td>
              {{ hl.highTeams.join(', ') }}
            </td>
            <td>
              {{ hl.lowDelta }}
            </td>
            <td>
              {{ hl.lowTeams.join(', ') }}
            </td>
          </tr>
          </table>
        </ul>      
      </div>

      <div style="margin-top: 2em; padding: 2em; text-align: left; margin:0 auto;border: 1px solid #2f363d; border-radius: 5px;">
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

// import TitleSingleSeason from './partials/TitleSingleSeason.vue'

export default {
  name: 'Season',
  components: {
    // TitleSingleSeason
  },
  async created() {
    // const currentTeams = this.$route.params.team || 'SAS';
      this.highLows = await this.fetchRankings();
    //       const availableTeams = await this.fetchTeams('2020');
    //   this.$store.commit('storeAvailableTeams', availableTeams)
    // this.$store.commit('changeTeam', currentTeams)

    // this.seasons = await this.fetchSeasons();
  },
  async mounted() {
    console.log('Just clicking')
    // await this.buildSeason();
       const currentTeams = this.$route.params.team || 'SAS';
    this.$store.commit('changeTeam', currentTeams)
    await this.changeTeam();
  },
  data: () => ({
    highLows: [],
    availableTeams: [],
    series: [],
      
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

    async fetchRankings() {
      const { data } = await this.$apollo.query({
        query: gql`
            query{
              seasonHighLow,
              {year, highTeams, highDelta, lowTeams, lowDelta }
            
          }`,
      }); 
      return data.seasonHighLow
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
    async changeSeason() {
      const availableTeams = await this.fetchTeams(this.$store.getters.currentSeason);
      this.$store.commit('storeAvailableTeams', availableTeams)
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
      // this.$router.push({ path: `/history//${this.season}/${team}` })     

    },

    resetTeams() {
      this.currentTeams = '';
      this.series = [];
    },

  }
}
</script>




