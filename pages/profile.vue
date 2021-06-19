<template>
  <v-layout column justify-left align-top>
    <h1>Profile</h1>
    <v-divider></v-divider><br />
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Name"
              v-model="this.person.name"
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
              :items="orgs"
              hint="Select applicable orgs from the list or type in your own"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-combobox
              label="Fields and Interests"
              multiple
              small-chips
              deletable-chips
              persistent-hint
              :items="interests"
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
    console.log(this.user)
  },
  computed: {
    ...mapState({
      person: state => state.user.user.person,
      org: state => state.user.user.organization
    })
  },
  data() {
    return {
      // TODO: FIXME
      // these lists should be provided dynamically from back-end by querying db for unique existing values
      // also entries need aliases
      orgs: [
        'ITI',
        'SRI',
        'University of Utah',
        'University of South Carolina',
        'University of Illinois'
      ],
      interests: [
        'Cybersecurity',
        'Machine Learning',
        'AI',
        'Software Development'
      ]
    }
  }
}
</script>
