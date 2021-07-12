<template>
  <v-layout column justify-left align-top>
    <h1>Profile</h1>
    <v-divider></v-divider><br />
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-if="this.user"
              label="Name"
              v-model="this.user.name"
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
              v-model="user.organization"
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
              v-model="user.research_interests"
              hint="Select applicable items from the list or type in your own"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-btn class="primary mt-4 ml-3">Update</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
  async mounted() {
    this.$store.dispatch('user/fetchUser')
    this.$store.dispatch('user/fetchOrgs')
    // this.$store.dispatch('user/fetchInterests')
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      orgs: state => state.user.orgs,
      interests: state => state.user.interests
    }),
    orgNames: function() {
      return this.orgs.map(m => m.name)
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
      ]
    }
  }
}
</script>
