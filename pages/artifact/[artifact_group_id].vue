<template>
  <div>
    <a @click="$router.go(-1)">Back</a>

    <div v-if="artifact.artifact">
      <div v-if="editing">
        <LazyHydrate when-visible>
          <KGArtifactEdit :record="artifact"></KGArtifactEdit>
        </LazyHydrate>
      </div>
      <div v-else-if="editingRelation">
        <LazyHydrate when-visible>
          <KGArtifactEditRelation :record="artifact"></KGArtifactEditRelation>
        </LazyHydrate>
      </div>
      <div v-else>
        <LazyHydrate when-visible>
          <KGArtifactLong :record="artifact"></KGArtifactLong>
        </LazyHydrate>
      </div>
    </div>
    <div v-else>{{ loadingMessage }}</div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState } from 'pinia'
import { artifactsStore } from '~/stores/artifacts'
import KGArtifactEditRelation from '~/components/KGArtifactEditRelation.vue'

export default defineComponent({
  components: {
    KGArtifactLong: defineAsyncComponent(() => import("@/components/KGArtifactLong")),
    KGArtifactEdit: defineAsyncComponent(() => import("@/components/KGArtifactEdit")),
    KGArtifactEditRelation: defineAsyncComponent(() => import("@/components/KGArtifactEditRelation")),
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
    ...mapState(artifactsStore, {
      artifact: state => state.artifact
    }),
    editing() {
      return this.$route.query.edit !== undefined
        && this.$route.query.edit == 'true' ? true : false
    },
    editingRelation() {
      return this.$route.query.edit_relation !== undefined
        && this.$route.query.edit_relation == 'true' ? true : false
    }
  },
  mounted() {
    this.$artifactsStore.fetchArtifact( {
      artifact_group_id: this.$route.params.artifact_group_id,
      id: this.$route.params.id
    })
  },
  watch: {
    $route (val) {
      // the user will have outdated artifact data when he returns from
      // editing page. In those cases, the mounted hook is not triggered
      // so we have to manually fetch new information
      if (!val.query.edit && !val.query.editing) {
        this.$store.dispatch('artifacts/fetchArtifact', {
          artifact_group_id: this.$route.params.artifact_group_id,
          id: this.$route.params.id
        })
      }
    }
  }
});
</script>
