<template>
  <div>
    <RecurringVenueList
      :recurringVenues="recurringVenues"
      :limit="limit"
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

const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

export default {
  components: {
    Logo: () => import("@/components/Logo"),
    RecurringVenueList: () => import("@/components/RecurringVenueList"),
  },
  head() {
    return {
      title: 'SEARCCH Venue Search',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Hub Venue Search Results'
        }
      ]
    }
  },
  data() {
    return {
      // limit: 10,
      // page: 1,
      // search: '',
      // searchMessage: '',
      // searchInterval: null,
      // submitted: false,
      // adopen: 1,
      // advanced: {
      //   types: [ 'conference', 'journal', 'magazine', 'newspaper', 'periodical', 'event', 'other' ],
      //   venue_ids: [],
      // },
      // types: [ 'conference', 'journal', 'magazine', 'newspaper', 'periodical', 'event', 'other' ],
      showScrollToTop: 0
    }
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted() {
    if (this.$route.query.keywords) {
      this.search = this.$route.query.keywords
      console.log('keywords: ', this.search)
      this.onSubmit()
    } else {
      this.search = this.search_init
      this.advanced = deepClone(this.search_advanced_init)
      this.adopen = +(!this.search_advanced_isopen)
    }
    this.$store.dispatch('user/fetchBadges')
    this.$store.dispatch('user/fetchVenues')
  },
  computed: {
    ...mapState({
      recurringVenues: state => state.venues.recurringVenues.recurring_venue,
      // pages: state => state.venues.recurringVenues.pages,
      // total: state => state.venues.recurringVenues.total,
      search_init: state => state.venues.search,
      search_advanced_init: state => state.venues.search_advanced,
      search_advanced_isopen: state => state.venues.search_advanced_isopen,
      searchLoading: state => state.venues.loading,
    }),
    allRecurringVenues() {
      return this.advanced.types.length === this.types.length
    },
    someRecurringVenues() {
      return this.advanced.types.length > 0 && !this.allArtifacts
    },
    recurringVenueTypeIcon() {
      if (this.allRecurringVenues) return 'mdi-close-box'
      if (this.someRecurringVenues) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },
  methods: {
    async onSubmit() {
      this.submitted = true
      if (this.searchInterval != null) clearTimeout(this.searchInterval)
      this.searchMessage = 'Searching...'
      this.$store.commit('venues/RESET_RECURRING_VENUES') // clear artifacts so the Searching... message is shown
      debugger
      let payload = {
        keywords: this.search,
        // page: this.page,
        // items_per_page: this.limit,
        type: this.advanced.types
      }
      this.$store.dispatch('venues/fetchRecurringVenues', { payload, advanced: this.advanced })
      this.searchInterval = setTimeout(() => {
        if (!this.searchLoading) {
          this.searchMessage = 'No results found'
        }
      }, 3000)
      this.submitted = false
    },
    onChange() {
      this.searchMessage = ''
    },
    toggle() {
      this.$nextTick(() => {
        if (this.allRecurringVenues) {
          this.advanced.types = []
        } else {
          this.advanced.types = this.types.slice()
        }
      })
    },
    scrollToTop() {
      goTo(0)
    },
    handleScroll() {
      this.showScrollToTop = window.scrollY
    },
    showOptions(val){
        if (val != "None"){
          this.sortEnabled = true
          this.advanced.sort_criteria = val
        }
        else{
          this.sortEnabled = false
        }
    },
  },
  watch: {
    page() {
      this.onSubmit()
    },
    searchLoading(val) {
      if (val) {
        this.searchMessage = 'Searching...'
      } else if (this.search !== '') {
        if (this.searchInterval != null) clearTimeout(this.searchInterval)
        this.searchMessage = 'No results found'
      } else {
        this.searchMessage = ''
      }
    }
  }
}
</script>

<style scoped>
.v-application--is-ltr .v-input__prepend-outer {
  margin-right: 0px;
}
.v-text-field--outlined .v-input__prepend-outer,
.v-text-field--outlined .v-input__append-outer {
  margin-top: 4px;
}
#scrollbtn {
  position: fixed;
  bottom: 50px;
  right: 0px;
  scroll-margin-bottom: 5rem;
}
</style>
