<template>
  <v-row justify="start" align="start">
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
                <h6 class="text-overline mb-3">
                  {{ localuser.name }}
                </h6>
                <h6
                  class="text-overline mb-3"
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
          <material-card color="primary" title="Profile">
            <v-form>
              <v-container class="py-0">
                <v-row v-if="localuser">
                  <v-col cols="12" md="8">
                    <v-text-field
                      label="Name"
                      class="primary-input"
                      v-model="localuser.name"
                      readonly
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Email Address"
                      class="primary-input"
                      v-model="localuser.email"
                      readonly
                    />
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-text-field
                      label="Website"
                      class="primary-input"
                      v-model="localuser.website"
                      readonly
                    />
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-combobox
                      v-if="localuser"
                      label="Interests"
                      multiple
                      chips
                      closable-chips
                      persistent-hint
                      :items="hardcodedInterests"
                      v-model="researchInterests"
                      hint="Select applicable items from the list or type in your own"
                      v-model:search-input="interestSearch"
                      return-object
                      readonly
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-title>
                            No results matching "<strong>{{
                              interestSearch
                            }}</strong
                            >". Press <kbd>tab</kbd> to create a new one item.
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-combobox
                      label="Affiliation"
                      multiple
                      chips
                      closable-chips
                      persistent-hint
                      :items="orgNames"
                      v-model="userAffiliation"
                      hint="Select applicable organization from the list or type in your own"
                      v-model:search-input="orgSearch"
                      item-title="org.name"
                      item-value="org.name"
                      return-object
                      readonly
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-title>
                            No results matching "<strong>{{
                              orgSearch
                            }}</strong
                            >". Press <kbd>tab</kbd> to create a new one
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </material-card>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>

<script>
import schemaWithPointers from '~/schema/affiliation.json'

export default defineComponent({
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
  watch: {},
  async mounted() {
    let response = await this.$userEndpoint.show(this.$route.params.id)
    this.localuser = response.user.person
    this.userAffiliation = response.user.affiliations
  },
  created() {
    this.$resolver.resolve(schemaWithPointers).then(schema => {
      this.schema = schema
      this.schemaLoaded = true
    }).catch(err => {
      // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
      // including referenced files, combined into a single object
      console.error(err)
    })
  },
  methods: {
    profileImage(email) {
      if (typeof this.authUser !== 'undefined') {
        if (typeof this.authUser.avatar_url !== 'undefined'
            && this.authUser.avatar_url.length > 0) {
          return this.authUser.avatar_url + '&size=130'
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
});
</script>
