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
      <h1>My artifacts</h1>
      <v-divider></v-divider>
      <ArtifactList :artifacts="artifacts" :limit="limit"></ArtifactList>
      <span v-if="artifacts.length == 0">No artifacts yet</span>
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
      title: 'SEARCCH My Artifacts',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH My Artifacts'
        }
      ]
    }
  },

  data() {
    return {
      limit: 20,
    }
  },
  computed: {
    ...mapState({
      artifacts: state => state.artifacts.myArtifacts.owned_artifacts,
    })
  },
  async mounted() {
    await this.$store.dispatch('artifacts/fetchMyArtifacts')
  },
}
</script>
