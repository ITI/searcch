<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col sm="12" md="10" lg="6">
        <div class="text-center">
          <logo />
        </div>
      </v-col>
    </v-row>
    <v-btn @click="$router.go(-1)" variant="plain" density="compact" prepend-icon="mdi-chevron-left">back</v-btn>
    <ArtifactImportView :artifact="artifact"></ArtifactImportView>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState } from 'pinia'
import { artifactsStore } from '~/stores/artifacts'

export default defineComponent({
  components: {
    Logo: defineAsyncComponent(() => import('@/components/Logo')),
    ArtifactImportView: defineAsyncComponent(() => import('@/components/ArtifactImportView'))
  },
  computed: {
    ...mapState(artifactsStore, {
      artifact: state => state.import
    })
  },
  mounted() {
    this.$artifactsStore.fetchImport( {
      id: this.$route.params.id
    })
  }
});
</script>
