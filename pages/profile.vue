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
                <v-img :src="gravatarImage(user.email)" />
              </v-avatar>
              <v-card-text v-if="user" class="text-center">
                <h6 class="overline mb-3">
                  {{ user.name }}
                </h6>
                <h6 class="overline mb-3">
                  {{ currentOrganization }}
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
                        label="Interests"
                        multiple
                        small-chips
                        deletable-chips
                        persistent-hint
                        v-if="user"
                        :items="hardcodedInterests"
                        v-model="researchInterests"
                        hint="Select applicable items from the list or type in your own"
                      ></v-combobox>
                    </v-col>

                    <v-col cols="12" md="12">
                      <v-combobox
                        label="Affiliations(s)"
                        multiple
                        small-chips
                        deletable-chips
                        persistent-hint
                        clearable
                        v-if="orgs"
                        :items="orgNames"
                        v-model="currentOrganization"
                        hint="Select applicable orgs from the list or type in your own"
                      ></v-combobox>
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
                      v-for="item in owned_artifacts"
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

export default {
  components: {
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  data() {
    return {
      // TODO: FIXME
      // these lists should be provided dynamically from back-end by querying db for unique existing values
      // also entries need aliases
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
      owned_artifacts: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      orgs: state => state.user.orgs,
      interests: state => state.user.interests
    }),
    orgNames: {
      get: function() {
        return this.orgs.map(m => m.name)
      },
      set: function(newValue) {
        this.$store.commit('user/SET_ORGS', newValue)
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
    currentOrganization: {
      get: function() {
        return this.user.organization
      },
      set: function(newValue) {
        this.$store.commit('user/SET_USER_ORG', newValue)
      }
    }
  },
  async mounted() {
    this.$store.dispatch('user/fetchUser')
    this.$store.dispatch('user/fetchOrgs')
    this.$store.dispatch('user/fetchInterests')
    let response = await this.$dashboardEndpoint.index()
    this.dashboard = response
    response = await this.$userArtifactsEndpoint.index()
    this.owned_artifacts = response.owned_artifacts
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
        // FIXME: remove when ready to update endpoint
        console.log(data)
        // this.$userEndpoint.update(this.user.user.id, data)
        // update organizations
        // TODO
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
      return btoa(encodeURI(image.data))
    }
  }
}
</script>
