<template>
  <div>
      <header/>

      <h1>Wins Heatmap</h1>

      <div class="flex space-x-4 mt-5">
        <div class="flex-auto w-1/5">
          <div>
            Season:
            <select class="form-control" v-model="year" @change="onChangeYear">
              <option v-for="y in years" :value="y" :key="y">{{ y }}</option>
            </select>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin: 2em auto; border: 1px solid #2f363d; border-radius: 5px; padding: 2em 1em 4em;">
        <div v-if="loading" style="height: 300px; display: flex; align-items: center; justify-content: center;">
          Loading standings...
        </div>
        <div v-else-if="placedTeams.length === 0" style="height: 300px; display: flex; align-items: center; justify-content: center;">
          No data available for {{ year }}
        </div>
        <div v-else class="heatmap-scale" :style="{ height: scaleHeight + 'px' }">
          <div class="heatmap-markers">
            <div
              v-for="t in placedTeams"
              :key="t.teamKey"
              class="heatmap-marker"
              :style="{ left: t.position + '%', bottom: (t.stack * 32 + 16) + 'px', backgroundColor: t.color }"
              :title="`${t.team} (${t.conference}) - ${t.wins}-${t.losses}`"
            >
              {{ t.teamKey }}
            </div>
          </div>
          <div class="heatmap-track"></div>
          <div
            v-for="tick in ticks"
            :key="tick"
            class="heatmap-tick"
            :style="{ left: ((tick - scaleMin) / (scaleMax - scaleMin) * 100) + '%' }"
          >
            <span class="heatmap-tick-label">{{ tick }}</span>
          </div>
        </div>
      </div>

      <div style="margin-top: 2em; padding: 2em; text-align: center; margin:0 auto;border: 1px solid #2f363d; border-radius: 5px;">
        Each team is placed on a scale from {{ scaleMin }} to {{ scaleMax }} wins, showing how many regular season games it won. Hover over a team to see its full win-loss record. Warmer colours indicate more wins.
        <p style="text-align:left;margin-top: 2em;">
          NB: This website is still in beta mode. There may be some inaccuracies with some of the data.
          <a href="/#/contact">Feel free to reach out</a> if you have any comment or if you want to receive updates on future releases.
        </p>
      </div>
  </div>
</template>

<style>
.heatmap-scale {
  position: relative;
  width: 92%;
  margin: 1em auto 0;
}

.heatmap-track {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #2f363d;
}

.heatmap-tick {
  position: absolute;
  bottom: -4px;
  transform: translateX(-50%);
  width: 1px;
  height: 10px;
  background-color: #2f363d;
}

.heatmap-tick-label {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75em;
  white-space: nowrap;
}

.heatmap-markers {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.heatmap-marker {
  position: absolute;
  transform: translateX(-50%);
  min-width: 44px;
  padding: 0 4px;
  height: 26px;
  line-height: 26px;
  border-radius: 4px;
  font-size: 0.7em;
  font-weight: bold;
  color: #fff;
  text-align: center;
  cursor: default;
}
</style>

<script>
export default {
  name: 'WinsHeatmap',
  data: () => ({
    year: 2026,
    years: Array.from({ length: 81 }, (_, i) => 2026 - i),
    teams: [],
    loading: true,
  }),
  computed: {
    scaleMin() {
      if (this.teams.length === 0) return 0;
      const minWins = Math.min(...this.teams.map(t => t.wins));
      return Math.max(0, Math.floor(minWins / 10) * 10);
    },
    scaleMax() {
      if (this.teams.length === 0) return this.scaleMin + 10;
      const maxWins = Math.max(...this.teams.map(t => t.wins));
      return Math.max(this.scaleMin + 10, Math.ceil(maxWins / 10) * 10);
    },
    ticks() {
      const ticks = [];
      for (let t = this.scaleMin; t <= this.scaleMax; t += 10) {
        ticks.push(t);
      }
      return ticks;
    },
    placedTeams() {
      const groups = {};
      for (const team of this.teams) {
        groups[team.wins] = groups[team.wins] || [];
        groups[team.wins].push(team);
      }

      const range = this.scaleMax - this.scaleMin;
      const placed = [];
      for (const wins of Object.keys(groups)) {
        groups[wins].forEach((team, stack) => {
          placed.push({
            ...team,
            position: ((Number(wins) - this.scaleMin) / range) * 100,
            color: this.heatColor(Number(wins)),
            stack,
          });
        });
      }
      return placed;
    },
    scaleHeight() {
      const maxStack = this.placedTeams.reduce((max, t) => Math.max(max, t.stack), 0);
      return 40 + (maxStack + 1) * 32;
    },
  },
  created() {
    const yearParam = Number(this.$route.params.year);
    if (yearParam && this.years.includes(yearParam)) {
      this.year = yearParam;
    }
  },
  async mounted() {
    await this.fetchStandings();
  },
  methods: {
    async fetchStandings() {
      this.loading = true;
      try {
        const response = await fetch(`/data/standings/${this.year}.json`);
        const data = await response.json();
        const east = (data.conferences.E || []).map(t => ({ ...t, conference: 'E' }));
        const west = (data.conferences.W || []).map(t => ({ ...t, conference: 'W' }));
        this.teams = [...east, ...west];
      } catch (err) {
        console.log(err);
        this.teams = [];
      } finally {
        this.loading = false;
      }
    },
    heatColor(wins) {
      const range = this.scaleMax - this.scaleMin;
      const ratio = Math.min(Math.max((wins - this.scaleMin) / range, 0), 1);
      const hue = 220 - (220 * ratio);
      return `hsl(${hue}, 70%, 45%)`;
    },
    async onChangeYear() {
      this.$router.push({ path: `/wins-heatmap/${this.year}` });
      await this.fetchStandings();
    },
  },
}
</script>
