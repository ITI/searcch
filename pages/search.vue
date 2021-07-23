<template>
  <div>
    <div class="text-center">
      <logo />
    </div>
    <h1>Search</h1>
    <v-divider></v-divider><br />
    <SearchCard />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import goTo from 'vuetify/es5/services/goto'

export default {
  components: {
    Logo: () => import('@/components/Logo'),
    ArtifactList: () => import('@/components/ArtifactList'),
    SearchCard: () => import('@/components/SearchCard')
  },
  head() {
    return {
      title: 'SEARCH Artifact Search',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Hub Artifact Search Results'
        }
      ]
    }
  },
  data() {
    return {}
  }
}
</script>
