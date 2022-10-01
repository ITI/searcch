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
      <div class="my-artifacts-header">
        <h1>My Artifacts</h1>
        <v-divider></v-divider>
        <ArtifactList :artifacts="myArtifacts.owned_artifacts" :limit="limit"></ArtifactList>
        <span v-if="doArtifactsExist()">No artifacts yet</span>
      </div>
      <div v-if="doContributionsExist()" class="my-artifacts-header">
        <h1>Contributed Artifacts</h1>
        <v-divider></v-divider>
        <ArtifactList :artifacts="myArtifacts.contributed_artifacts" :limit="limit"></ArtifactList>
      </div>
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
      limit: 20
    }
  },
  methods: {
    doContributionsExist() {
      return this.myArtifacts.contributed_artifacts !== undefined && this.myArtifacts.contributed_artifacts.length > 0;
    },
    doArtifactsExist() {
      return this.myArtifacts.owned_artifacts !== undefined && this.myArtifacts.owned_artifacts.length == 0;
    }
  },
  computed: {
    ...mapState({
      myArtifacts: state => state.artifacts.myArtifacts
    })
  },
  async mounted() {
    await this.$store.dispatch('artifacts/fetchMyArtifacts')
  },
}
</script>

<style>

  .my-artifacts-header {
    margin-top: 20px;
  }

</style>