<template>
  <v-layout column justify-left align-top>
    <v-container fill-height fluid>
      <v-row justify="center">
        <v-col cols="12" md="4" v-if="localuser">
          <LazyHydrate never>
            <material-card class="v-card-profile">
              <v-avatar
                slot="offset"
                class="mx-auto d-block elevation-6"
                size="130"
              >
                <v-img :src="profileImage(localuser.email)"></v-img>
              </v-avatar>
              <v-card-text class="text-center">
                <h6 class="overline mb-3">
                  {{ localuser.name }}
                </h6>
                <h6
                  class="overline mb-3"
                  v-if="userAffiliation"
                  v-for="affil in userAffiliation"
                >
                  <div v-if="affil.org">{{ affil.org.name }}</div>
                </h6>

                <p class="font-weight-light">
                  {{ localuser.email }}
                </p>
              </v-card-text>
            </material-card>
          </LazyHydrate>
        </v-col>

        <v-col cols="12" md="8">
          <material-card
            color="primary"
            title="Edit Profile"
            text="Complete your profile"
          >
            <v-form>
              <v-container class="py-0">
                <v-row v-if="localuser">
                  <v-col cols="12" md="8">
                    <v-text-field
                      label="Name"
                      class="primary-input"
                      v-model="localuser.name"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Email Address"
                      class="primary-input"
                      v-model="localuser.email"
                      readonly
                      disabled
                    />
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-text-field
                      label="Website"
                      class="primary-input"
                      v-model="localuser.website"
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
                              >". Press <kbd>tab</kbd> to create a new one item.
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
                              >". Press <kbd>tab</kbd> to create a new one
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
      interestSearch: null,
      localuser: null
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      organization: state => state.user.organization,
      userid: state => state.user.userid,
      orgs: state => state.user.orgs,
      interests: state => state.user.interests,
      githubUser: state => state.auth.user
    }),
    orgNames: {
      get: function() {
        return this.orgs ? this.orgs.map(m => m.name) : []
      }
    },
    researchInterests: {
      get: function() {
        return this.localuser.research_interests
          ? this.localuser.research_interests.split(',')
          : ''
      },
      set: function(newValue) {
        this.localuser.research_interests = newValue.join(',')
      }
    },
    types: function() {
      if (this.schemaLoaded) {
        return this.schema.properties.type.enum
      } else return []
    }
  },
  watch: {
    userAffiliation(newValue, oldValue) {
      // delete case
      let diff = oldValue.filter(
        affil => newValue.findIndex(newAffil => newAffil.id == affil.id) == -1
      )
      if (diff.length > 0) {
        diff.forEach(affil => {
          if (typeof affil === 'object') {
            // cannot use await here as this is inside a foreach loop
            this.$userAffiliationEndpoint.delete(affil.id)
          }
        })
        diff = []
      }
    },
    organization(val) {
      this.userAffiliation = val
    },
    user(val) {
      this.localuser = JSON.parse(JSON.stringify(val))
    }
  },
  async mounted() {
    this.$store.dispatch('user/fetchUser')
    this.$store.dispatch('user/fetchOrgs')
    this.$store.dispatch('user/fetchInterests')
    let response = await this.$dashboardEndpoint.index()
    this.dashboard = response
    this.userAffiliation = this.organization ? this.organization : []
    this.localuser = JSON.parse(JSON.stringify(this.user))
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
    async updateProfile() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        await this.$userEndpoint.update(this.userid, this.localuser)

        // create any affiliations that were added
        this.userAffiliation.forEach((affil, index, object) => {
          if (typeof affil === 'string') {
            this.$store.dispatch('user/createAffiliation', affil)
            object.splice(index, 1)
          }
        })
        this.$store.dispatch('user/fetchUser')
      }
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    profileImage(email) {
      if (typeof this.githubUser !== 'undefined') {
        if (this.githubUser.avatar_url.length > 0) {
          return this.githubUser.avatar_url + '&size=130'
        }
      }
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
