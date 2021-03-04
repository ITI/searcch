<template>
  <div>
    <div class="text-center">
      <logo />
    </div>
    <h1>Search</h1>
    <v-divider></v-divider><br>
    <v-form ref="search" @submit.prevent="onSubmit">
      <v-text-field
        light
        solo
        append-icon="mdi-magnify"
        placeholder="Type keyword..."
        v-model="search"
        loading="true"
        clearable
        class="rounded-0"
        hide-details
      >
      </v-text-field>
      <v-expansion-panels model="advanced.open">
        <v-expansion-panel  class="rounded-0">
          <v-expansion-panel-header>
            <template v-slot:default="{ open }">
              <v-row no-gutters>
                <v-col cols="4">
                  Advanced
                </v-col>
                <v-col
                  cols="8"
                  class="text--secondary"
                >
                  <v-fade-transition leave-absolute>
                    <span
                      v-if="open"
                      key="0"
                    >
                      Select advanced filters for your query
                    </span>
                    <span
                      v-else
                      key="1"
                    >
                      {{ advanced.query }}
                    </span>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row align="center">
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
                    <v-list-item
                      ripple
                      @click="toggle"
                    >
                      <v-list-item-action>
                        <v-icon :color="advanced.types.length > 0 ? 'indigo darken-4' : ''">
                          {{ aterfactTypeIcon }}
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
                    <span ></span>
                    <span
                      v-if="index === 1"
                      class="grey--text caption"
                    >
                      (+{{ advanced.types.length - 1 }} others)
                    </span>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <v-text-field
                  v-model="advanced.author"
                  placeholder="Kevin Bacon, Shaquille O'Neil"
                  label="Author Name(s)"
                  class="rounded-0"
                  hide-details
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <v-text-field
                  v-model="advanced.org"
                  placeholder="University of Illinois"
                  label="Orginization"
                  class="rounded-0"
                  hide-details
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
    <div hidden>
      <v-select
        v-model="searchsource"
        :items="engines"
        label="Search Engine"
      ></v-select>
    </div>
    <br>
    <v-divider></v-divider>
    <ArtifactList :artifacts="artifacts" :limit="limit"></ArtifactList>
    <span v-if="artifacts.length == 0 && searchLoading == true">{{ searchMessage }}</span>
    <span v-if="artifacts.length == 0 && searchLoading == false"><h3>Type a search term into the input above and press Enter</h3></span>
    <v-btn v-if="showScrollToTop != 0" class="primary" id="scrollbtn" @click="scrollToTop()" elevation="10">Back to Top</v-btn>
  </div>
</template>

<script>
import ArtifactList from '~/components/ArtifactList'
import Logo from '~/components/Logo.vue'
import { mapState } from 'vuex'
import goTo from 'vuetify/es5/services/goto'

export default {
  components: {
    Logo,
    ArtifactList
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
      searchsource: 'kg',
      engines: ['kg', 'zenodo'],
      limit: 20,
      search: this.search_init || '',
      searchLoading: false,
      searchMessage: 'Loading...',
      advanced: {
        open: false,
        types: ['Dataset','Publication','Code'],
        author: '',
        org: '',
      },
      types: [
        'Dataset',
        'Publication',
        'Code',
        'Executable',
        'Methodology',
        'Metrics',
        'Hypothesis',
        'Domain',
        'Supporting Info',
        'Prior Work',
      ],
      filters: [
        'Name',
        'Organization',
      ],
      showScrollToTop: 0,
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  mounted () {
    if(this.$route.query.keywords) {
      this.search = this.$route.query.keywords
      this.onSubmit()
    }
  },
  computed: {
    ...mapState({
      artifacts: state => state.artifacts.artifacts,
      source: state => state.artifacts.source,
      search_init: state => state.artifacts.search,
    }),
    allArtifacts () {
      return this.advanced.types.length === this.types.length
    },
    someArtifacts () {
      return this.advanced.types.length > 0 && !this.allArtifacts
    },
    aterfactTypeIcon () {
      if (this.allArtifacts) return 'mdi-close-box'
      if (this.someArtifacts) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    advancedPlaceholder () {
      if (this.advanced.filter === "Name") return "First or Last name"
      if (this.advanced.filter === "Organization") return "Organization name"
    },
  },
  methods: {
    async onSubmit() {
      this.searchLoading = true
      this.searchMessage = "Loading..."
      this.$store.commit('artifacts/SET_ARTIFACTS', []) // clear artifacts so the loading... message is shown
      this.$store.commit('artifacts/SET_SOURCE', this.searchsource)
      let payload
      // comment out advanced query options for first test demo or until API built
      // if (!this.advanced.open) {
        payload = {
          keywords: this.search
        }
      // } else {
      //   payload = {
      //     keywords: this.search,
      //     type: this.advanced.types,
      //     author: null,
      //     orginization: null
      //   }
      // }
      // if (this.advanced.filter == "Name") {
      //   payload.author = this.advanced.query
      // } else if (this.advanced.filter == "Organization") {
      //   payload.orginization = this.advanced.query
      // }
      this.$store.dispatch('artifacts/fetchArtifacts', payload)
      setTimeout(() => { 
        this.searchMessage = "No results found"
      }, 5000);
    },
    toggle () {
      this.$nextTick(() => {
        if (this.allArtifacts) {
          this.advanced.types = []
        } else {
          this.advanced.types = this.types.slice()
        }
      })
    }, 
    scrollToTop () {
      goTo(0)
    },
    handleScroll () {
      this.showScrollToTop = window.scrollY
    }
  }
}
</script>

<style scoped>
  .v-application--is-ltr .v-input__prepend-outer {
    margin-right: 0px;
  }
  .v-text-field--outlined .v-input__prepend-outer, .v-text-field--outlined .v-input__append-outer {
    margin-top: 4px;
  }
  #scrollbtn {
    position: fixed;
    bottom: 80px;
    right: 30px;
}
</style>