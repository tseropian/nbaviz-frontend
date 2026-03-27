<template>
  <div class="roster-tenure text-left max-w-[1700px] mx-auto px-2 pb-8">
    <h1 class="text-2xl md:text-3xl mb-2 font-bold">
      What season did NBA players join their teams?
    </h1>
    <p class="text-sm text-gray-600 mb-6 max-w-3xl">
      Each cell is how many players on that team’s roster (for the season you pick) first joined the franchise in that season column.
      Two-way players are excluded when flagged in scraped data.
    </p>

    <div class="mb-6 flex flex-wrap items-center gap-3">
      <label for="rt-season" class="text-sm font-medium">Roster season</label>
      <select
        id="rt-season"
        v-model.number="selectedYear"
        class="border border-gray-400 rounded px-3 py-1.5 text-sm bg-white text-gray-900"
        @change="onSeasonChange"
      >
        <option v-for="y in seasonOptions" :key="y" :value="y">
          {{ formatSeasonLabel(y) }}
        </option>
      </select>
    </div>

    <div v-if="loadError" class="text-red-600 text-sm">{{ loadError }}</div>
    <div v-else-if="loading" class="text-center py-16 text-gray-500">Loading…</div>

    <div v-else-if="!teamsForYear.length" class="text-gray-600 text-sm">
      No roster data for this season. Run the scraper and processor (see PLAN.md), or pick another year.
    </div>

    <div v-else class="overflow-x-auto pb-4">
      <div
        class="inline-grid gap-y-1 gap-x-0.5 items-stretch"
        :style="gridTemplateStyle"
      >
        <!-- header row -->
        <div class="text-xs font-semibold p-1 text-gray-500 min-w-[4rem]" />
        <div
          v-for="sy in columnYears"
          :key="'h-' + sy"
          class="text-xs font-semibold p-1 text-center text-gray-700 min-w-[2.75rem]"
        >
          {{ shortSeason(sy) }}
        </div>
        <div class="text-xs font-semibold p-1 text-gray-700 min-w-[11rem]">Team</div>

        <!-- data rows -->
        <template v-for="team in teamsForYear" :key="team.key">
          <div class="text-[10px] text-gray-400 pr-1 flex items-center min-w-[4rem]" />
          <button
            v-for="sy in columnYears"
            :key="team.key + '-' + sy"
            type="button"
            class="min-h-[2.25rem] min-w-[2.75rem] border border-gray-200 rounded text-xs font-semibold transition hover:ring-2 hover:ring-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col items-center justify-center p-0.5"
            :class="cellHeatClass(cellCount(team, sy))"
            :title="cellTooltip(team, sy)"
            @click="openCellModal(team, sy)"
          >
            <span v-if="cellCount(team, sy)">{{ cellCount(team, sy) }}</span>
            <span
              v-if="inlineNames(team, sy)"
              class="text-[9px] leading-tight font-normal text-center line-clamp-2 w-full px-0.5"
            >
              {{ inlineNames(team, sy) }}
            </span>
          </button>
          <router-link
            class="flex items-center gap-2 text-xs sm:text-sm font-medium hover:underline pl-1 min-w-[11rem] text-gray-900"
            :to="`/roster-tenure/${selectedYear}/team/${team.key}`"
          >
            <span
              class="inline-block w-3 h-3 rounded-full flex-shrink-0 border border-gray-300"
              :style="{ backgroundColor: team.color }"
            />
            <span class="leading-tight">{{ team.name }}</span>
          </router-link>
        </template>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="modal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div class="px-4 py-3 border-b flex justify-between items-start gap-2">
          <div>
            <h2 class="text-lg font-bold">{{ modal.team.name }}</h2>
            <p class="text-sm text-gray-600">
              Joined in {{ formatSeasonLabel(modal.season) }} · {{ modal.players.length }} player(s)
            </p>
          </div>
          <button
            type="button"
            class="text-gray-500 hover:text-gray-800 text-2xl leading-none px-1"
            aria-label="Close"
            @click="closeModal"
          >
            ×
          </button>
        </div>
        <ul class="overflow-y-auto px-4 py-3 text-sm space-y-2">
          <li
            v-for="(p, i) in modal.players"
            :key="i"
            class="flex justify-between gap-2 border-b border-gray-100 pb-2 last:border-0"
          >
            <span class="font-medium">{{ p.name }}</span>
            <span class="text-gray-500 shrink-0">{{ p.pos || '—' }}</span>
          </li>
        </ul>
      </div>
    </div>

    <footer class="mt-10 text-xs text-gray-500 space-y-2 border-t border-gray-200 pt-4 max-w-3xl">
      <p>Two-way players excluded when the scraper can detect them.</p>
      <p>
        A single missed season between roster years is still treated as one continuous stint (aligned with the original chart note on mid-season movement).
      </p>
      <p class="italic">
        Chart concept: Lev Akabas (@levakabas). Built with scraped basketball-reference.com rosters.
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'RosterTenure',
  data() {
    return {
      loading: true,
      loadError: null,
      selectedYear: null,
      modal: null,
    }
  },
  computed: {
    payload() {
      return this.$store.getters.rosterTenureData
    },
    seasonOptions() {
      if (!this.payload?.data) return []
      return Object.keys(this.payload.data)
        .map(Number)
        .sort((a, b) => b - a)
    },
    columnYears() {
      if (!this.payload?.seasons?.length) return []
      return this.payload.seasons.map(Number).sort((a, b) => a - b)
    },
    teamsForYear() {
      if (!this.payload?.data || this.selectedYear == null) return []
      const block = this.payload.data[String(this.selectedYear)]
      return block?.teams || []
    },
    gridTemplateStyle() {
      const n = this.columnYears.length
      return {
        gridTemplateColumns: `minmax(3rem,4rem) repeat(${n}, minmax(2.5rem, 2.75rem)) minmax(10rem, 14rem)`,
      }
    },
  },
  watch: {
    '$route.params.year'() {
      this.syncYearFromRoute()
    },
  },
  async created() {
    await this.ensurePayload()
    this.syncYearFromRoute()
  },
  methods: {
    async ensurePayload() {
      if (this.$store.getters.rosterTenureData) {
        this.loading = false
        return
      }
      this.loading = true
      this.loadError = null
      try {
        const res = await fetch(`${process.env.BASE_URL}data/roster-tenure.json`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        this.$store.commit('setRosterTenureData', json)
      } catch (e) {
        this.loadError = 'Could not load roster-tenure.json. Add public/data/roster-tenure.json or run the parser.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    syncYearFromRoute() {
      const fromRoute = this.$route.params.year
      const y = fromRoute != null && fromRoute !== '' ? Number(fromRoute) : null
      if (y && !Number.isNaN(y)) {
        this.selectedYear = y
        this.$store.commit('setRosterTenureSeason', y)
        return
      }
      const opts = this.seasonOptions
      if (opts.length && (this.selectedYear == null || !opts.includes(this.selectedYear))) {
        this.selectedYear = opts[0]
        this.$store.commit('setRosterTenureSeason', this.selectedYear)
        if (!fromRoute) {
          this.$router.replace(`/roster-tenure/${this.selectedYear}`)
        }
      }
    },
    onSeasonChange() {
      this.$store.commit('setRosterTenureSeason', this.selectedYear)
      this.$router.push(`/roster-tenure/${this.selectedYear}`)
    },
    formatSeasonLabel(endYear) {
      const y = Number(endYear)
      return `${y - 1}-${String(y).slice(-2)}`
    },
    shortSeason(endYear) {
      return `'${String(endYear).slice(-2)}`
    },
    cellCount(team, seasonEndYear) {
      const jm = team.joinMap || {}
      const cell = jm[String(seasonEndYear)]
      return cell ? cell.count : 0
    },
    cellHeatClass(count) {
      if (!count) return 'bg-gray-50 text-gray-300'
      if (count === 1) return 'bg-amber-100 text-amber-950'
      if (count === 2) return 'bg-orange-200 text-orange-950'
      if (count <= 4) return 'bg-orange-400 text-white'
      if (count <= 6) return 'bg-fuchsia-700 text-white'
      return 'bg-indigo-950 text-white'
    },
    cellTooltip(team, seasonEndYear) {
      const n = this.cellCount(team, seasonEndYear)
      if (!n) return `${team.name} — ${this.formatSeasonLabel(seasonEndYear)}: 0`
      const jm = team.joinMap[String(seasonEndYear)]
      const names = (jm?.players || []).map((p) => p.name).join(', ')
      return `${team.name} — ${this.formatSeasonLabel(seasonEndYear)}: ${n} — ${names}`
    },
    inlineNames(team, seasonEndYear) {
      const n = this.cellCount(team, seasonEndYear)
      if (n < 1 || n > 2) return ''
      const jm = team.joinMap[String(seasonEndYear)]
      const players = jm?.players || []
      return players
        .map((p) => this.shortPlayerName(p.name))
        .join(', ')
    },
    shortPlayerName(full) {
      const parts = full.trim().split(/\s+/)
      if (parts.length === 1) return parts[0]
      return parts[parts.length - 1]
    },
    openCellModal(team, seasonEndYear) {
      const n = this.cellCount(team, seasonEndYear)
      if (!n) return
      const jm = team.joinMap[String(seasonEndYear)]
      this.modal = {
        team,
        season: seasonEndYear,
        players: jm?.players ? [...jm.players] : [],
      }
    },
    closeModal() {
      this.modal = null
    },
  },
}
</script>
