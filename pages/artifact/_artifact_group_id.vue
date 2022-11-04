<template>
  <div>
    <a @click="$router.go(-1)">Back</a>

    <div v-if="artifact.artifact">
      <div v-if="editing">
        <LazyHydrate when-visible>
          <KGArtifactEdit :record="artifact"></KGArtifactEdit>
        </LazyHydrate>
      </div>
      <div v-if="editingRelation">
        <LazyHydrate when-visible>
          <KGArtifactEdit :record="artifact"></KGArtifactEdit>
        </LazyHydrate>
      </div>
      <div v-if="!editing && !editingRelation">
        <LazyHydrate when-visible>
          <KGArtifactEditRelation :record="artifact"></KGArtifactEditRelation>
        </LazyHydrate>
      </div>
    </div>
    <div v-else>{{ loadingMessage }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import KGArtifactEditRelation from '~/components/KGArtifactEditRelation.vue'

export default {
  components: {
    KGArtifactLong: () => import("@/components/KGArtifactLong"),
    KGArtifactEdit: () => import("@/components/KGArtifactEdit"),
    KGArtifactEditRelation: () => import("@/components/KGArtifactEditRelation"),
    LazyHydrate: () => import("vue-lazy-hydration"),
},
  head() {
    return {
      title: this.artifact.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.artifact.title
        }
      ]
    }
  },
  data() {
    return {
      loadingMessage: 'Loading...'
    }
  },
  computed: {
    ...mapState({
      artifact: state => state.artifacts.artifact
    }),
    editing() {
      return this.$route.query.edit !== undefined
        && this.$route.query.edit == 'true' ? true : false
    },
    editingRelation() {
      return this.$route.query.editRelation !== undefined
        && this.$route.query.editRelation == 'true' ? true : false
    }
  },
  mounted() {
    this.$store.dispatch('artifacts/fetchArtifact', {
      artifact_group_id: this.$route.params.artifact_group_id,
      id: this.$route.params.id
    })
  }
}
</script>
