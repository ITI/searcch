<template>
<span>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
        <div class="text-center">
        <logo />
        </div>
        
    </v-flex>
  </v-layout>
  <v-layout column justify-left align-top>
    <h1>Profile</h1>
    <v-divider></v-divider><br>
    <v-form>
        <v-text-field
            label="Name"
            placeholder="First Last"
            outlined
            full-width
        ></v-text-field>
        <v-btn
            class="primary"
        >Update</v-btn>
    </v-form>
  </v-layout>
</span>
</template>

<script>
import Logo from '~/components/Logo.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Logo,
  },
  data() {
    return {
      limit: 20,
    }
  },
  async mounted () {
    if (this.user_id) return // this.$store.dispatch('artifacts/fetchFavorites', this.user_id)
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
    }),
  }
}
</script>