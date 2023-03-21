<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="mx-2">
        <a @click="$router.go(-1)">Back</a>
        <br>
        <h2>
          {{ venue.title }}
          <a :href="venue.url" style="text-decoration: none;">
            <v-icon>mdi-link-variant</v-icon>
          </a>
        </h2>
      </v-col>
      <v-col cols="12">
        <v-container>
          <v-row>
            <v-col cols="9">
              <div v-if="artifactsLoading">Loading...</div>
              <ArtifactList v-else-if="artifacts.length" 
                :artifacts="artifacts"
              />
              <div v-else class="no-artifact-container">
                <h1 class="text-grey">Oops...</h1>
                No published artifacts for this venue session yet... : (
              </div>
            </v-col>
            <v-col cols="3">
              <div class="text-caption text-grey">
                <br><b>Description</b>: {{ venue.description }}
                <v-divider></v-divider>
                <br><b>Publisher Url</b>: {{ venue.publisher_url || 'N/A' }}
                <v-divider></v-divider>
              </div>

              <v-radio-group :value="currentRecurrenceId" density="compact">
                <v-radio 
                  v-for="recurrence in venue.recurrences" 
                  :key="recurrence.id"
                  :value="recurrence.id"
                  :label="recurrence.abbrev"
                  @change="onRecurrenceSelected(recurrence.id)">
                </v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
    ArtifactList: () => import('@/components/ArtifactList')
  },
  async mounted() {
    let response = await this.$recurringVenueEndpoint.show(this.$route.params.id)
    this.$store.commit('venues/SET_CURRENT_VENUE', response)
    console.log(this.$store.state.venues)
    if (this.currentRecurrenceId !== undefined) {
      this.$store.dispatch('venues/fetchArtifacts', {
        venue_id: this.currentRecurrenceId
      })
    }
  },
  computed: {
    ...mapState({
      artifacts: state => state.venues.artifacts.artifacts,
      venue: state => state.venues.currentVenue,
      currentRecurrenceId: state => state.venues.recurrenceId,
      loading: state => state.venues.loading,
      artifactsLoading: state => state.venues.artifactsLoading
    })
  },
  methods: {
    onRecurrenceSelected(recurrenceId) {
      this.$store.commit('venues/SET_RECURRENCE_ID', recurrenceId)
      this.$store.dispatch('venues/fetchArtifacts', {
        venue_id: recurrenceId
      })
    }
  }
}
</script>

<style>
.no-artifact-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>