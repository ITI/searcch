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
      <v-col cols="12">
        <h1>Favorites</h1>
        <v-divider></v-divider>
        <ArtifactList :artifacts="artifacts" :limit="limit"></ArtifactList>
        <span v-if="artifacts.length == 0">No favorites loaded</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState } from 'pinia'
import { userStore } from '~/stores/user'
import { artifactsStore } from '~/stores/artifacts'

export default defineComponent({
  components: {
    Logo: defineAsyncComponent(() => import('@/components/Logo')),
    ArtifactList: defineAsyncComponent(() => import('@/components/ArtifactList'))
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
      this.$artifactsStore.fetchFavorites(this.userid)
  },
  computed: {
    ...mapState(userStore, {
      userid: state => state.userid
    }),
    ...mapState(artifactsStore, {
      artifacts: state => state.favorites
    })
  }
});
</script>
