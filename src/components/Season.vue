<template>
  <div>
    SEASON {{ $route.params.year }}
 
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
  name: 'HelloWorld',
  mounted() {
    console.log('created called.');
    console.log()
    console.log(process.env);//.GRAPHQL_HOST)
    // console.log(GRAPHQL_HOST)
    this.buildSeason();
    this.series = this.buildSeries();
  },
  data: () => ({
    currentSeason: 0,
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
          '10 Jan', '11 Jan', '12 Jan'
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
    seasons: gql`query{
      seasons(year: "2006"){
        year, startDate, endDate
      }
    }`,
    rankings: gql`query{
      rankings(season: "2006", teams: "MIA") {
        team, position
      }
    }`,
  },
  methods:{
    buildSeason() {
      console.log('Lets go')
      console.log(this.teams)
    },

    buildSeries() {
      return [
      {
        name: "Session Duration",
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
      },
      {
        name: "Page Views",
        data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
      },
      {
        name: 'Total Visits',
        data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
      }
    ]
    }
  }
}
</script>




