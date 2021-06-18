<template>
  <div v-if="artifact.artifact">
    <span v-if="!edit">
      <KGCodeArtifactLong
        v-if="artifact.artifact.type == 'code'"
        :record="artifact"
      ></KGCodeArtifactLong>
      <KGArtifactLong v-else :record="artifact" />
    </span>
    <span v-else>
      <KGArtifactEdit :record="artifact"></KGArtifactEdit>
    </span>
  </div>
  <div v-else>{{ loadingMessage }}</div>
</template>

<script>
import KGArtifactLong from '@/components/KGArtifactLong'
import { mapState } from 'vuex'
import KGCodeArtifactLong from './KGCodeArtifactLong.vue'
import KGArtifactEdit from './KGArtifactEdit.vue'

export default {
  components: {
    KGArtifactLong,
    KGCodeArtifactLong,
    KGArtifactEdit
  },
  props: {
    artifact: {
      type: Object,
      required: true
    },
    edit: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loadingMessage: 'Loading...'
    }
  },
  mounted() {
    setTimeout(() => {
      this.loadingMessage = 'Error loading'
    }, 5000)
  },
  computed: {
    ...mapState({
      source: state => state.artifacts.source
    })
  }
}
</script>
