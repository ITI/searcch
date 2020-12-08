<template>
  <div v-if="artifact.artifact">
    <KGCodeArtifactLong v-if="artifact.artifact.type == 'code'" :record="artifact"></KGCodeArtifactLong>
    <KGArtifactLong v-else :record="artifact"/>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import ZenodoArtifactLong from '@/components/ZenodoArtifactLong'
import KGArtifactLong from '@/components/KGArtifactLong'
import { mapState } from 'vuex'
import KGCodeArtifactLong from './KGCodeArtifactLong.vue'

export default {
  components: {
    ZenodoArtifactLong,
    KGArtifactLong,
    KGCodeArtifactLong,
  },
  props: {
    artifact: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      source: state => state.artifacts.source
    })
  }
}
</script>
