<template>
  <div>
    <v-form ref="search" @submit.prevent="onSubmit">
      <v-text-field
        append-icon="mdi-magnify"
        label="Search"
        placeholder="Type search term..."
        v-model="search"
        loading="true"
        clearable
        class="rounded-0"
        hide-details
        @keydown="onChange"
        @change="onSubmit"
        solo
        dense
      >
      </v-text-field>
      <v-expansion-panels v-model="adopen">
        <v-expansion-panel class="rounded-0">
          <v-expansion-panel-header>
            <template v-slot:default="{ open }">
              <v-row no-gutters>
                <v-col cols="4">
                  Advanced
                </v-col>
                <v-col cols="8" class="text--secondary">
                  <v-fade-transition leave-absolute>
                    <span v-if="open" key="0">
                      Select advanced filters for your query
                    </span>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row align="center">
              <v-col cols="12">
                <v-text-field
                  label="Author"
                  placeholder="Search for artifacts by author name..."
                  v-model="advanced.author"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Organization"
                  placeholder="Search for artifacts by organization name..."
                  v-model="advanced.org"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="advanced.types"
                  :items="types"
                  label="Artifact types"
                  multiple
                  class="rounded-0"
                  hide-details
                >
                  <template v-slot:prepend-item>
                    <v-list-item ripple @click="toggle">
                      <v-list-item-action>
                        <v-icon
                          :color="
                            advanced.types.length > 0 ? 'indigo darken-4' : ''
                          "
                        >
                          {{ artifactTypeIcon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          Select All
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <span v-if="index === 0">{{ item }}</span>
                    <span></span>
                    <span v-if="index === 1" class="grey--text caption">
                      (+{{ advanced.types.length - 1 }} others)
                    </span>
                  </template>
                </v-select>
              </v-col>
              
              <v-col cols="12">
                <v-select
                  v-model="advanced.badge_ids"
                  :items="badges"
                  :item-value="item => item.id"
                  label="Artifact badges"
                  multiple
                  class="rounded-0"
                  hide-details
                >
                  <template v-slot:prepend-item>
                    <v-list-item ripple @click="toggleBadges">
                      <v-list-item-action>
                        <v-icon
                          :color="
                            advanced.badge_ids.length > 0 ? 'indigo darken-4' : ''
                          "
                        >
                          {{ badgeIcon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          Select All
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <span v-if="index === 0">{{ `${item.organization} ${item.title}` }}</span>
                    <span></span>
                    <span v-if="index === 1" class="grey--text caption">
                      (+{{ advanced.badge_ids.length - 1 }} others)
                    </span>
                  </template>
                  <template v-slot:item="{ item, index }">
                    {{ `${item.organization} ${item.title}` }}
                  </template>
                </v-select>
              </v-col>
              
              <v-col cols="12">
                <v-select
                  v-model="advanced.venue_ids"
                  :items="venues"
                  :item-value="item => item.id"
                  label="Artifact venues"
                  multiple
                  class="rounded-0"
                  hide-details
                >
                  <template v-slot:prepend-item>
                    <v-list-item ripple @click="toggleVenues">
                      <v-list-item-action>
                        <v-icon
                          :color="
                            advanced.venue_ids.length > 0 ? 'indigo darken-4' : ''
                          "
                        >
                          {{ venueIcon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          Select All
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <span v-if="index === 0">{{ `${item.title}` }}</span>
                    <span></span>
                    <span v-if="index === 1" class="grey--text caption">
                      (+{{ advanced.venue_ids.length - 1 }} others)
                    </span>
                  </template>
                  <template v-slot:item="{ item, index }">
                    {{ `${item.title}` }}
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" sm ="8">
                <v-select v-model="advanced.search_criteria" label="Sort Results" :items="['None','date', 'views', 'rating']" @change = "showOptions">
                </v-select>
              </v-col>
              
              <v-col cols="12" sm="4">
                <v-radio-group v-model="advanced.search_type" v-if="sortEnabled" @change="setSortType" row>
                  <v-radio label="Ascending" value="asc"></v-radio>
                  <v-radio label="Descending" value="desc"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-if="$auth.loggedIn && this.user_can_admin && this.user_is_admin"
                  label="Owner"
                  placeholder="Search for artifacts by owner name..."
                  v-model="owner"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-btn @click="onSubmit" class="primary mt-3">Search</v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
    <br />
    <v-divider></v-divider>
    <v-pagination
      v-if="artifacts"
      v-model="page"
      :length="pages"
      circle
    ></v-pagination>
    <ArtifactList
      :artifacts="artifacts"
      :limit="limit"
      v-bind:related="related"
    ></ArtifactList>
    <span v-if="artifacts.total == 0 && search !== ''">{{
      searchMessage
    }}</span>
    <span v-if="!searchLoading && artifacts.total == 0 && search === ''"
      ><h3>Type a search term into the input above and press Enter</h3></span
    >
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
import { getCookie } from '~/helpers'

const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

export default {
  components: {
    Logo: () => import('@/components/Logo'),
    ArtifactList: () => import('@/components/ArtifactList')
  },
  props: {
    related: {
      type: Boolean,
      required: false
    }
  },
  head() {
    return {
      title: 'SEARCH Artifact Search',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Hub Artifact Search Results'
        }
      ]
    }
  },
  data() {
    return {
      limit: 10,
      page: 1,
      search: '',
      owner: '',
      sortEnabled : false,
      searchMessage: '',
      searchInterval: null,
      submitted: false,
      adopen: 1,
      advanced: {
        types: ['dataset', 'presentation', 'publication', 'software', 'other'],
        author: '',
        org: '',
        badge_ids: [],
        venue_ids: [],
        sort_criteria: '',
        sort_type: 'desc',
      },
      types: ['dataset', 'presentation', 'publication', 'software', 'other'],
      filters: ['Name', 'Organization'],
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
    if (this.related) {
      this.$store.dispatch('artifacts/fetchRelatedArtifacts', this.artifact)
    } else if (this.$route.query.keywords) {
      this.search = this.$route.query.keywords
      console.log('keywords: ', this.search)
      this.onSubmit()
    } else if (this.$route.query.author_keywords) {
      this.advanced.author = this.$route.query.author_keywords
      console.log('author_keywords: ', this.advanced.author)
      this.onSubmit()
      this.adopen = 0
    } else if (this.$route.query.badge_ids) {
      this.advanced.badge_ids = this.$route.query.badge_ids
      console.log('badge_ids: ', this.advanced.badge_ids)
      this.onSubmit()
      this.adopen = 0
    } else if (this.$route.query.venue_ids) {
      this.advanced.venue_ids = this.$route.query.venue_ids
      console.log('venue_ids: ', this.advanced.venue_ids)
      this.onSubmit()
      this.adopen = 0
    } else {
      this.search = this.search_init
      this.advanced = deepClone(this.search_advanced_init)
      this.adopen = +(!this.search_advanced_isopen)
      this.sortEnabled = this.advanced.search_criteria !== ''
    }
    this.$store.dispatch('user/fetchBadges')
    this.$store.dispatch('user/fetchVenues')
  },
  computed: {
    ...mapState({
      badges: state => state.user.badges,
      venues: state => state.user.venues,
      artifacts: state => state.artifacts.artifacts.artifacts,
      artifact: state => state.artifacts.artifact.artifact,
      pages: state => state.artifacts.artifacts.pages,
      total: state => state.artifacts.artifacts.total,
      search_init: state => state.artifacts.search,
      search_advanced_init: state => state.artifacts.search_advanced,
      search_advanced_isopen: state => state.artifacts.search_advanced_isopen,
      searchLoading: state => state.artifacts.loading,
      user_is_admin: state => state.user.user_is_admin,
      user_can_admin: state => state.user.user_can_admin,
    }),
    allArtifacts() {
      return this.advanced.types.length === this.types.length
    },
    someArtifacts() {
      return this.advanced.types.length > 0 && !this.allArtifacts
    },
    artifactTypeIcon() {
      if (this.allArtifacts) return 'mdi-close-box'
      if (this.someArtifacts) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    allBadges() {
      return this.advanced.badge_ids.length === this.badges.length
    },
    someBadges() {
      return this.advanced.badge_ids.length > 0 && !this.allBadges
    },
    badgeIcon() {
      if (this.allBadges) return 'mdi-close-box'
      if (this.someBadges) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    allVenues() {
      return this.advanced.venue_ids.length === this.venues.length
    },
    someVenues() {
      return this.advanced.venue_ids.length > 0 && !this.allVenues
    },
    venueIcon() {
      if (this.allVenues) return 'mdi-close-box'
      if (this.someVenues) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    advancedPlaceholder() {
      if (this.advanced.filter === 'Name') return 'First or Last name'
      if (this.advanced.filter === 'Organization') return 'Organization name'
    }
  },
  methods: {
    async onSubmit() {
      this.submitted = true
      if (this.searchInterval != null) clearTimeout(this.searchInterval)
      this.searchMessage = 'Searching...'
      this.$store.commit('artifacts/RESET_ARTIFACTS') // clear artifacts so the Searching... message is shown
      if (this.related && this.search.trim() === '') {
        this.$store.dispatch('artifacts/fetchRelatedArtifacts', this.artifact)
      } else {
        let payload = {
          keywords: this.search,
          page: this.page,
          items_per_page: this.limit,
          type: this.advanced.types
        }

        this.advanced.author ? (payload['author'] = this.advanced.author) : false
        this.advanced.badge_ids ? (payload['badge_id'] = this.advanced.badge_ids) : false
        this.advanced.venue_ids ? (payload['venue_id'] = this.advanced.venue_ids) : false
        this.advanced.org ? (payload['organization'] = this.advanced.org) : false
        this.advanced.sort_criteria ? (payload['sort'] = this.advanced.sort_criteria): false
        this.advanced.sort_type ? (payload['order'] = this.advanced.sort_type) :false
        this.owner ? (payload['owner'] = this.owner) : false
        this.$store.dispatch('artifacts/fetchArtifacts', { payload, advanced: this.advanced })
      } 
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
        if (this.allArtifacts) {
          this.advanced.types = []
        } else {
          this.advanced.types = this.types.slice()
        }
      })
    },
    toggleBadges() {
      this.$nextTick(() => {
        if (this.allBadges) {
          this.advanced.badge_ids = []
        } else {
          this.advanced.badge_ids = this.badges.map(x => x.id)
        }
      })
    },
    toggleVenues() {
      this.$nextTick(() => {
        if (this.allVenues) {
          this.advanced.venue_ids = []
        } else {
          this.advanced.venue_ids = this.venues.map(x => x.id)
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
    setSortType(val){
      this.advanced.sort_type = val
    }
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
