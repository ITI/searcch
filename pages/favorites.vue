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
import { mapState } from 'vuex'

export default {
  components: {
    Logo: () => import('@/components/Logo'),
    ArtifactList: () => import('@/components/ArtifactList')
  },
  head() {
    return {
      title: 'SEARCCH Favorite Artifacts',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Favorite Artifacts'
        }
      ]
    }
  },

  data() {
    return {
      limit: 20
    }
  },
  async mounted() {
    if (this.userid)
      this.$store.dispatch('artifacts/fetchFavorites', this.userid)
  },
  computed: {
    ...mapState({
      artifacts: state => state.artifacts.favorites,
      userid: state => state.user.userid
    })
  }
}
</script>
