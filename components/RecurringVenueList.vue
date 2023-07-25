<template>
  <div>
    <v-container>
      <v-row v-for="venue in recurringVenues" :key="venue.id">
        <v-col>
          <LazyHydrate when-visible>
            <RecurringVenueShort
              :recurringVenue="venue"
            ></RecurringVenueShort>
          </LazyHydrate>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  components: {
    RecurringVenueShort: () => import('@/components/RecurringVenueShort'),
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  props: {
    recurringVenues: {
      type: Array,
      required: true
    },
  },
  data() {
    return {}
  }
}
</script>
