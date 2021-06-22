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
      <h1>Favorites</h1>
      <v-divider></v-divider>
      <ArtifactList :artifacts="artifacts" :limit="limit"></ArtifactList>
      <span v-if="artifacts.length == 0">No favorites loaded</span>
    </v-layout>
  </span>
</template>

<script>
import ArtifactList from '~/components/ArtifactList'
import Logo from '~/components/Logo.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Logo,
    ArtifactList
  },
  data() {
    return {
      limit: 20
    }
  },
  async mounted() {
    if (this.user_id)
      this.$store.dispatch('artifacts/fetchFavorites', this.user_id)
  },
  computed: {
    ...mapState({
      artifacts: state => state.artifacts.favorites,
      user_id: state => state.user.user_id
    })
  }
}
</script>
