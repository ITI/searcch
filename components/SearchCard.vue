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
        filled
      >
      </v-text-field>
      <v-expansion-panels v-model="adopen" flat popup>
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
      :length="10"
      circle
    ></v-pagination>
    <ArtifactList
      :artifacts="artifacts"
      :limit="limit"
      v-bind:related="related"
    ></ArtifactList>
    <span v-if="artifacts.length == 0 && search !== ''">{{
      searchMessage
    }}</span>
    <span v-if="!searchLoading && artifacts.length == 0 && search === ''"
      ><h3>Type a search term into the input above and press Enter</h3></span
    >
    <v-btn
      v-if="showScrollToTop != 0"
      class="primary"
      id="scrollbtn"
      @click="scrollToTop()"
      elevation="10"
      >Back to Top</v-btn
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
import goTo from 'vuetify/es5/services/goto'

export default {
  components: {
    Logo: () => import('@/components/Logo'),
    ArtifactList: () => import('@/components/ArtifactList')
  },
  props: {
    related: {
      type: Boolean,
      required: false
    },
    all: {
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
      limit: 20,
      page: 1,
      search: '',
      searchMessage: '',
      searchInterval: null,
      submitted: false,
      adopen: [0],
      advanced: {
        types: ['dataset', 'software'],
        author: '',
        org: ''
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
    if (this.$route.query.keywords) {
      this.search = this.$route.query.keywords
      this.onSubmit()
    } else {
      this.search = this.search_init
    }
    if (this.all) {
      this.advanced.types = this.types
    }
  },
  computed: {
    ...mapState({
      artifacts: state => state.artifacts.artifacts,
      search_init: state => state.artifacts.search,
      searchLoading: state => state.artifacts.loading
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
    advancedPlaceholder() {
      if (this.advanced.filter === 'Name') return 'First or Last name'
      if (this.advanced.filter === 'Organization') return 'Organization name'
    },
    dynamicLength() {
      return this.artifacts.length ? Math.ceil(this.artifacts.length / 20) : 1
    }
  },
  methods: {
    async onSubmit() {
      this.submitted = true
      if (this.searchInterval != null) clearTimeout(this.searchInterval)
      this.searchMessage = 'Searching...'
      this.$store.commit('artifacts/SET_ARTIFACTS', []) // clear artifacts so the Searching... message is shown
      let payload = {
        keywords: this.search,
        page: this.page,
        entity: 'artifact',
        type: this.advanced.types
      }

      this.$store.dispatch('artifacts/fetchArtifacts', payload)
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
    scrollToTop() {
      goTo(0)
    },
    handleScroll() {
      this.showScrollToTop = window.scrollY
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
  bottom: 80px;
  right: 30px;
  scroll-margin-bottom: 5rem;
}
</style>
