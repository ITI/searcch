<template>
  <!-- <div> -->
    <!-- <v-container> -->
      <v-card>
        <!-- <v-row no-gutters class="recurring-venue-container"> -->
          <!-- <v-col cols="10"> -->
            <v-card-title class="align-start">
              <span class="headline">{{ recurringVenue.title | titlecase }}</span>
            </v-card-title>
            <v-card-text v-html="sanitizedDescription"> </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="onRelatedArtifactsClicked">
                Related Artifacts
              </v-btn>
            </v-card-actions>
          <!-- </v-col>
          <v-col cols="2" class="recurrence-container">
            <v-list density="compact" class="list">
              <v-list-item v-for="item in recurringVenue.recurrences" :key="item.title" :value="item">
                <v-list-item-title>{{ item.abbrev }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col> -->
        <!-- </v-row> -->
      </v-card>
    <!-- </v-container>
  </div> -->
</template>

<script>
import clip from 'text-clipper'

export default {
  props: {
    recurringVenue: {
      type: Object,
      required: true
    },
  },
  components: {
    RecurringVenueChip: () => import("@/components/RecurringVenueChip"),
  },
  computed: {
    sanitizedDescription: function () {
      let description = ''
      description = this.recurringVenue.description
      return clip(this.$sanitize(description), 2000, {
        html: true,
        maxLines: 40
      })
    }
  },
  methods: {
    onRelatedArtifactsClicked() {
      this.$store.commit('venues/SET_RECURRENCE_ID', this.recurringVenue.recurrences[0].id)
      this.$router.push('/recurringvenue/' + this.recurringVenue.id)
    },
  }
}
</script>

<style scoped>
.card-chip {
  position: absolute;
  top: 0px;
  right: 0px;
}

.v-card__title {
  word-break: normal;
}

.headline {
  align-self: center;
}

.recurring-venue-container {
  overflow: auto;
}

.recurrence-container {
  border-left: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.recurrence-container .list {
  margin-left: 10px;
  background-color: transparent;
  max-height: 100%;
  overflow: scroll;
}
</style>
