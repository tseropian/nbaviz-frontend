<template>
  <div class="roster-tenure-team text-left max-w-2xl mx-auto px-4 pb-12">
    <router-link
      :to="`/roster-tenure/${year}`"
      class="text-sm text-blue-700 hover:underline"
    >
      ← Back to tenure matrix
    </router-link>

    <div v-if="loadError" class="text-red-600 mt-6 text-sm">{{ loadError }}</div>
    <div v-else-if="loading" class="text-center py-16 text-gray-500">Loading…</div>
    <template v-else-if="team">
      <h1 class="text-2xl font-bold mt-6">{{ team.name }}</h1>
      <p class="text-gray-600 mt-1">{{ formatSeasonLabel(year) }} roster · {{ team.totalPlayers }} players</p>

      <table class="w-full mt-8 text-sm border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 text-left p-2">Player</th>
            <th class="border border-gray-300 text-left p-2">Pos</th>
            <th class="border border-gray-300 text-left p-2">Joined (season)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in team.roster" :key="i">
            <td class="border border-gray-300 p-2 font-medium">{{ row.name }}</td>
            <td class="border border-gray-300 p-2 text-gray-600">{{ row.pos || '—' }}</td>
            <td class="border border-gray-300 p-2">{{ formatSeasonLabel(row.joinSeason) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <p v-else class="mt-8 text-gray-600">Team not found for this season.</p>
  </div>
</template>

<script>
export default {
  name: 'RosterTenureTeam',
  data() {
    return {
      loading: true,
      loadError: null,
    }
  },
  computed: {
    year() {
      return Number(this.$route.params.year)
    },
    teamKey() {
      return this.$route.params.teamKey
    },
    payload() {
      return this.$store.getters.rosterTenureData
    },
    team() {
      if (!this.payload?.data?.[String(this.year)]?.teams) return null
      return this.payload.data[String(this.year)].teams.find((t) => t.key === this.teamKey) || null
    },
  },
  async created() {
    await this.ensurePayload()
    this.loading = false
  },
  methods: {
    async ensurePayload() {
      if (this.$store.getters.rosterTenureData) return
      this.loadError = null
      try {
        const res = await fetch(`${process.env.BASE_URL}data/roster-tenure.json`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        this.$store.commit('setRosterTenureData', json)
      } catch (e) {
        this.loadError = 'Could not load roster-tenure.json.'
        console.error(e)
      }
    },
    formatSeasonLabel(endYear) {
      const y = Number(endYear)
      return `${y - 1}-${String(y).slice(-2)}`
    },
  },
}
</script>
