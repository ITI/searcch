<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <RecurringVenueList
      :recurringVenues="recurringVenues"
    ></RecurringVenueList>
    <v-btn
      v-if="showScrollToTop != 0"
      class="secondary"
      id="scrollbtn"
      @click="scrollToTop()"
      elevation="10"
      ><v-icon large color="lightblue">mdi-chevron-up</v-icon></v-btn
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
import goTo from 'vuetify/es5/services/goto'

export default {
  components: {
    RecurringVenueList: () => import("@/components/RecurringVenueList"),
},
  head() {
    return {
      title: 'SEARCCH Recurring Venues Search',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Hub Recurring Venues Search Results'
        }
      ]
    }
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted() {
    this.$store.dispatch('venues/fetchRecurringVenues')
  },
  computed: {
    ...mapState({
      recurringVenues: state => state.venues.recurringVenues.recurring_venues,
      loading: state => state.venues.recurringVenues.loading,
    }),
    recurringVenueTypeIcon() {
      if (this.allRecurringVenues) return 'mdi-close-box'
      if (this.someRecurringVenues) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },
  data() {
    return {
      showScrollToTop: 0
    }
  },
  methods: {
    scrollToTop() {
      goTo(0)
    },
    handleScroll() {
      this.showScrollToTop = window.scrollY
    },
  },
}
</script>
