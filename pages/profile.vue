<template>
  <v-layout column justify-left align-top>
    <v-container fill-height fluid>
      <v-row justify="center">
        <v-col cols="12" md="4" v-if="user">
          <LazyHydrate never>
            <material-card class="v-card-profile">
              <v-avatar
                slot="offset"
                class="mx-auto d-block elevation-6"
                size="130"
              >
                <v-img :src="gravatarImage(user.email)"></v-img>
              </v-avatar>
              <v-card-text v-if="user" class="text-center">
                <h6 class="overline mb-3">
                  {{ user.name }}
                </h6>
                <h6
                  class="overline mb-3"
                  v-if="userAffiliation"
                  v-for="affil in userAffiliation"
                >
                  <div v-if="affil.org">{{ affil.org.name }}</div>
                </h6>

                <p class="font-weight-light">
                  {{ user.email }}
                </p>
              </v-card-text>
            </material-card>
          </LazyHydrate>
        </v-col>

        <v-col cols="12" md="8">
          <LazyHydrate when-visible>
            <material-card
              color="primary"
              title="Edit Profile"
              text="Complete your profile"
            >
              <v-form>
                <v-container class="py-0">
                  <v-row v-if="user">
                    <v-col cols="12" md="8">
                      <v-text-field
                        label="Name"
                        class="primary-input"
                        :value="user.name"
                        @input="updateName"
                      />
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        label="Email Address"
                        class="primary-input"
                        :value="user.email"
                      />
                    </v-col>

                    <v-col cols="12" md="12">
                      <v-text-field
                        label="Website"
                        class="primary-input"
                        :value="user.website"
                        @input="updateWebsite"
                      />
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-combobox
                        v-if="user"
                        label="Interests"
                        multiple
                        small-chips
                        deletable-chips
                        persistent-hint
                        :items="hardcodedInterests"
                        v-model="researchInterests"
                        hint="Select applicable items from the list or type in your own"
                        :search-input.sync="interestSearch"
                        return-object
                      >
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>
                                No results matching "<strong>{{
                                  interestSearch
                                }}</strong
                                >". Click outside this window to create a new
                                item.
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-combobox>
                    </v-col>

                    <v-col cols="12" md="12">
                      <v-combobox
                        label="Affiliation"
                        multiple
                        small-chips
                        deletable-chips
                        persistent-hint
                        :items="orgNames"
                        v-model="userAffiliation"
                        hint="Select applicable organization from the list or type in your own"
                        :search-input.sync="orgSearch"
                        item-text="org.name"
                        item-value="org.name"
                        return-object
                      >
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>
                                No results matching "<strong>{{
                                  orgSearch
                                }}</strong
                                >". Press <kbd>enter</kbd> or click outside this
                                window to create a new one
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-combobox>
                    </v-col>

                    <v-col cols="12" class="text-right">
                      <v-btn color="success" @click="updateProfile">
                        Update Profile
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </material-card>
          </LazyHydrate>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid>
      <v-row>
        <v-col cols="12" lg="12">
          <LazyHydrate when-visible>
            <material-card class="card-tabs" color="primary">
              <template v-slot:header>
                <v-tabs
                  v-model="tabs"
                  background-color="transparent"
                  slider-color="white"
                  class="ml-4"
                >
                  <v-tab class="mr-3">
                    <v-icon class="mr-2">
                      mdi-database
                    </v-icon>
                    Artifacts
                  </v-tab>
                  <v-tab class="mr-3">
                    <v-icon class="mr-2">
                      mdi-star
                    </v-icon>
                    Ratings
                  </v-tab>
                  <v-tab>
                    <v-icon class="mr-2">
                      mdi-heart
                    </v-icon>
                    Favorites
                  </v-tab>
                </v-tabs>
              </template>

              <v-tabs-items v-model="tabs">
                <v-tab-item>
                  <!-- artifacts -->
                  <v-timeline align-top dense>
                    <v-timeline-item
                      v-for="item in dashboard.owned_artifacts"
                      :key="item.ctime"
                      :color="iconColor(item.type)"
                      :icon="iconImage(item.type)"
                      small
                    >
                      <div>
                        <div class="font-weight-normal">
                          <strong>{{ Date(item.ctime) }}</strong>
                        </div>
                        <div>
                          {{ item.title }}
                          <v-btn
                            class="v-btn--simple"
                            color="primary"
                            icon
                            :to="`/artifact/${item.id}`"
                            nuxt
                          >
                            <v-icon color="primary">
                              mdi-arrow-top-right-thick
                            </v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </v-tab-item>
                <v-tab-item>
                  <!-- ratings -->
                  <v-list
                    single-line
                    class="py-0"
                    v-for="(item, i) in dashboard.given_ratings"
                    :key="i"
                  >
                    <v-list-item>
                      <v-chip :color="iconColor(item.type)" class="ma-2" label>
                        <v-avatar left>
                          <v-icon>{{ iconImage(item.type) }}</v-icon>
                        </v-avatar>
                        <div>{{ item.type }}</div>
                      </v-chip>

                      <v-list-item-title v-text="item.title" />

                      <div class="d-flex">
                        <v-tooltip top content-class="top">
                          <template v-slot:activator="{ attrs, on }">
                            <v-chip
                              color="amber"
                              class="ma-2"
                              label
                              :to="`/artifact/review/${item.id}`"
                              nuxt
                            >
                              <v-avatar left>
                                <v-icon> mdi-star </v-icon>
                              </v-avatar>
                              <div>{{ item.rating }}</div>
                            </v-chip>
                          </template>
                          <span>Goto Rating</span>
                        </v-tooltip>
                      </div>
                    </v-list-item>
                    <v-divider />
                  </v-list>
                </v-tab-item>
                <v-tab-item>
                  <!-- favorites -->
                  <v-list
                    single-line
                    class="py-0"
                    v-for="(item, i) in dashboard.favorite_artifacts"
                    :key="i"
                  >
                    <v-list-item>
                      <v-chip :color="iconColor(item.type)" class="ma-2" label>
                        <v-avatar left>
                          <v-icon>{{ iconImage(item.type) }}</v-icon>
                        </v-avatar>
                        <div>{{ item.type }}</div>
                      </v-chip>
                      <v-list-item-title v-text="item.title" />

                      <div class="d-flex">
                        <v-tooltip top content-class="top">
                          <template v-slot:activator="{ attrs, on }">
                            <v-btn
                              class="v-btn--simple"
                              color="primary"
                              icon
                              v-bind="attrs"
                              v-on="on"
                              :to="`/artifact/${item.id}`"
                              nuxt
                            >
                              <v-icon color="primary">
                                mdi-arrow-top-right-thick
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>Goto Artifact</span>
                        </v-tooltip>
                      </div>
                    </v-list-item>
                    <v-divider />
                  </v-list>
                </v-tab-item>
              </v-tabs-items>
            </material-card>
          </LazyHydrate>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { artifactIcon, artifactColor } from '@/helpers'
import $RefParser from 'json-schema-ref-parser'
import schemaWithPointers from '~/schema/affiliation.json'

export default {
  components: {
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  head() {
    return {
      title: 'SEARCCH User Profile',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH User Profile'
        }
      ]
    }
  },
  data() {
    return {
      // TODO: FIXME get dynamically from backend once there are enough entries
      hardcodedInterests: [
        'Application Security',
        'Artificial Intelligence',
        'Biometrics',
        'Cloud Computing',
        'Cybersecurity',
        'Data Security',
        'Human-based Behavior',
        'Internet of Things',
        'Machine Learning',
        'Mobile',
        'Organizational Security Management',
        'Policy',
        'Privacy',
        'Secure Development',
        'Software Development',
        'Testbeds'
      ],
      tabs: 0,
      dashboard: {},
      // owned_artifacts: [],
      schema: {},
      schemaLoaded: false,
      userAffiliation: [],
      orgSearch: null,
      interestSearch: null
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      organization: state => state.user.organization,
      userid: state => state.user.userid,
      orgs: state => state.user.orgs,
      interests: state => state.user.interests
    }),
    orgNames: {
      get: function() {
        return this.orgs ? this.orgs.map(m => m.name) : []
      }
    },
    researchInterests: {
      get: function() {
        return this.user.research_interests
          ? this.user.research_interests.split(',')
          : ''
      },
      set: function(newValue) {
        this.$store.commit('user/SET_USER_INTERESTS', newValue.join(','))
      }
    },
    types: function() {
      if (this.schemaLoaded) {
        return this.schema.properties.type.enum
      } else return []
    }
  },
  watch: {
    userAffiliation: function(newValue, oldValue) {
      // delete case
      let diff = oldValue.filter(function(obj) {
        return newValue.indexOf(obj) == -1
      })
      if (diff.length > 0) {
        diff.forEach(affil => {
          if (typeof affil === 'object') {
            this.$userAffiliationEndpoint.delete(affil.id)
          }
        })
        diff = []
      }
    }
  },
  async mounted() {
    this.$store.dispatch('user/fetchUser')
    this.$store.dispatch('user/fetchOrgs')
    this.$store.dispatch('user/fetchInterests')
    let response = await this.$dashboardEndpoint.index()
    this.dashboard = response
    this.userAffiliation = this.organization ? this.organization : []
  },
  created() {
    $RefParser.dereference(schemaWithPointers, (err, schema) => {
      if (err) {
        console.error(err)
      } else {
        // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
        // including referenced files, combined into a single object
        this.schema = schema
        this.schemaLoaded = true
      }
    })
  },
  methods: {
    updateProfile() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        // update profile
        const data = {
          name: this.user.name,
          research_interests: this.user.research_interests,
          website: this.user.website,
          profile_photo: this.user.profile_photo
          // profile_photo: this.fetchGravatar(this.user.email)
        }
        this.userAffiliation.forEach(affil => {
          if (typeof affil === 'string') {
            this.$userAffiliationsEndpoint.create({
              org: { name: affil, type: 'Institution' }
            })
          }
        })

        this.$userEndpoint.update(this.userid, data)
      }
    },
    updateName(e) {
      this.$store.commit('user/SET_NAME', e)
    },
    updateWebsite(e) {
      this.$store.commit('user/SET_WEBSITE', e)
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    gravatarImage(email) {
      var md5 = require('md5')
      const url =
        'https://www.gravatar.com/avatar/' +
        md5(email.toLowerCase().trim()) +
        '?size=130'
      return url
    },
    async fetchGravatar(email) {
      let image = await this.$axios.get(
        '/avatar/' + this.gravatarImage(this.user.email).split('/')[4]
      )
      return Buffer.from(encodeURI(image.data), 'base64')
    }
  }
}
</script>
