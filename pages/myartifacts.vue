<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col sm="12" md="10" lg="6">
        <div class="text-center">
          <logo />
        </div>
      </v-col>
    </v-row>
    <v-row justify="start" align="start">
      <div class="my-artifacts-header">
        <h1>My Artifacts</h1>
        <v-divider></v-divider>
        <ArtifactList :artifacts="myArtifacts.owned_artifacts" :limit="limit"></ArtifactList>
        <span v-if="doArtifactsExist()">No artifacts yet</span>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState } from 'pinia'
import { artifactsStore } from '~/stores/artifacts'

export default defineComponent({
  components: {
    Logo: defineAsyncComponent(() => import('@/components/Logo')),
    ArtifactList: defineAsyncComponent(() => import('@/components/ArtifactList'))
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
    doArtifactsExist() {
      return this.myArtifacts.owned_artifacts !== undefined && this.myArtifacts.owned_artifacts.length == 0;
    }
  },
  computed: {
    ...mapState(artifactsStore, {
      myArtifacts: state => state.myArtifacts
    })
  },
  async mounted() {
    await this.$artifactsStore.fetchMyArtifacts()
  },
});
</script>

<style>

  .my-artifacts-header {
    margin-top: 20px;
  }

</style>