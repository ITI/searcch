<template>
  <div>
    <v-layout column justify-center align-center>
      <v-flex xs12 sm8 md6>
        <div class="text-center">
          <logo />
        </div>
      </v-flex>
    </v-layout>
    <a @click="$router.go(-1)">Back</a>
    <ArtifactImportView :artifact="artifact"></ArtifactImportView>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
    Logo: () => import('@/components/Logo'),
    ArtifactImportView: () => import('@/components/ArtifactImportView')
  },
  computed: {
    ...mapState({
      artifact: state => state.artifacts.import
    })
  },
  mounted() {
    this.$store.dispatch('artifacts/fetchImport', {
      id: this.$route.params.id
    })
  }
}
</script>
