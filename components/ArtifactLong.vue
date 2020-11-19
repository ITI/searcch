<template>
  <div>
    <KGArtifactLong :record="artifact"/>
  </div>
</template>

<script>
import ZenodoArtifactLong from '@/components/ZenodoArtifactLong'
import KGArtifactLong from '@/components/KGArtifactLong'
import { mapState } from 'vuex'

export default {
  components: {
    ZenodoArtifactLong,
    KGArtifactLong
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
