<template>
  <v-layout column justify-left align-top>
    <v-container fluid>
      <v-row>
        <v-col cols="12" lg="12">
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
                <v-list
                  three-line
                  class="py-0"
                  v-for="(item, i) in dashboard.owned_artifacts"
                  :key="i"
                >
                  <v-list-item>
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
              <v-tab-item>
                <!-- ratings -->
                <v-list
                  three-line
                  class="py-0"
                  v-for="(item, i) in dashboard.given_ratings"
                  :key="i"
                >
                  <v-list-item>
                    <!-- FIXME: change to title when API changes -->
                    <v-list-item-title v-text="item.artifact_id" />

                    <div class="d-flex">
                      <v-tooltip top content-class="top">
                        <template v-slot:activator="{ attrs, on }">
                          <v-btn
                            class="v-btn--simple"
                            text
                            v-bind="attrs"
                            v-on="on"
                            v-text="item.rating"
                            :to="`/artifact/review/${item.artifact_id}`"
                            nuxt
                          >
                          </v-btn>
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
                  three-line
                  class="py-0"
                  v-for="(item, i) in dashboard.favourite_artifacts"
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
        </v-col>
      </v-row>
    </v-container>

    <h1>Profile</h1>
    <v-divider></v-divider><br />

    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-if="user"
              label="Name"
              :value="user.name"
              @input="updateName"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-if="user"
              label="Email"
              v-model="user.email"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-if="user"
              label="Website"
              :value="user.website"
              @input="updateWebsite"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-combobox
              label="Organization(s)"
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
        </v-row>
        <v-row>
          <v-col cols="12">
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
        </v-row>
        <v-row>
          <v-btn class="primary mt-4 ml-3" @click="updateProfile">Update</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { artifactIcon, artifactColor } from '@/helpers'

export default {
  components: {},
  async mounted() {
    this.$store.dispatch('user/fetchUser')
    this.$store.dispatch('user/fetchOrgs')
    // this.$store.dispatch('user/fetchInterests')
    let response = await this.$dashboardEndpoint.index()
    this.dashboard = response
    console.log(this.dashboard)
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
        return this.interests ? this.interests.split(',') : ''
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
        this.$store.commit('user/SET_ORG', newValue)
      }
    }
  },
  data() {
    return {
      // TODO: FIXME
      // these lists should be provided dynamically from back-end by querying db for unique existing values
      // also entries need aliases
      hardcodedInterests: [
        'Applications Security',
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
      dashboard: {}
    }
  },
  methods: {
    updateProfile() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        // update interests
        const data = {
          name: this.user.name,
          research_interests: this.user.research_interests,
          website: this.user.website,
          profile_photo: this.user.profile_photo
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
    }
  }
}
</script>
