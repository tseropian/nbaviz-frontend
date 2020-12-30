<template>
  <div>
    SEASON {{ $route.params.year }}
 
    <input v-model="currentTeams" placeholder="edit me" @change="onChangeTeam($event)">
    {{ currentTeams }}

    <template>
      <div>
        <apexchart width="980" type="line" :options="options" :series="series"></apexchart>
      </div>
    </template>

  </div>
</template>

<script>

import gql from 'graphql-tag'

export default {
  name: 'Season',
  created() {
    this.buildSeason();
  },
  async mounted() {
    console.log('I have been mounted')
      await this.fetchRankings()
    this.series = this.buildSeries();

  },
  data: () => ({
    currentSeason: 0,
    currentTeams: 'SEA',
    options: {
      chart: {
        id: 'vuechart-example'
      },
      xaxis: {
        categories: [
         "Jan",
         "Feb",
         "Mar",
         "Apr",
         "May",
         "Jun",
         "Jul",
         "Aug",
         "Sep",
         "Oct",
         "Nov",
         "Dec"
        ]
      },
      yaxis: {
        reversed: true,
        min:1,
        max:15,
       
      }
    },
    series: [],
    chartOptions: {
      chart: {
        height: 350,
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
        text: 'Page Statistics',
        align: 'left'
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
          '10 Jan', '11 Jan', '12 Jan',
        ],
      },

      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (mins)"
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val + " per session"
              }
            }
          },
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
    teams: gql`query{
      teams {
        colour, key, name, city
      }
    }`,
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
    buildSeason() {
      console.log('Lets go')
      console.log('Ranking for teams: ' + this.currentTeams)
      this.currentSeason = this.$route.params.year;
    },
    async fetchRankings() {
      const { data } = await this.$apollo.query({
        query: gql`
          query Team(
            $teams: String
          ) {
            rankings(
              season: "2006", 
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
        teams: this.currentTeams
      }  
      }); 
      this.rankings = data.rankings;
    },
    buildSeries() {
      const serie = {
        name: this.currentTeams,
        data: []
      }
      let i=0;
      for (let rank of this.rankings) {
        if (i < 12) {
          serie.data.push(15 - rank.position)
        }
        i++;
      }
      return [serie];
    },
    async onChangeTeam() {
      await this.fetchRankings()
      this.series = this.buildSeries();
    }
  }
}
</script>




