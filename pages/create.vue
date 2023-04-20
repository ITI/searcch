<template>
  <div>
    <KGArtifactEdit :record="emptyArtifact" create />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    KGArtifactEdit: defineAsyncComponent(() => import('@/components/KGArtifactEdit'))
  },
  head() {
    return {
      title: 'SEARCCH Manual Artifact Creation',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Hub Manual Artifact Creation'
        }
      ]
    }
  },
  data() {
    return {
      emptyArtifact: {
        artifact: {
          title: '',
          description: '',
          url: '',
          tags: [],
          artifact_group: {
            relationships: [],
          },
          files: [],
          meta: []
        }
      }
    }
  }
});
</script>
