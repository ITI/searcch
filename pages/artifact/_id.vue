<template>
  <div>
    <router-link to="/search">Back</router-link>
    <ArtifactLong :artifact="artifact" :source="source" :limit="limit" />
  </div>
</template>

<script>
import ArtifactLong from '~/components/ArtifactLong'

// FIXME: remove test data import
import testdata from '~/static/kgtest.json'

export default {
  components: {
    ArtifactLong
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
      artifact: {},
      limit: 20,
      source: ''
    }
  },
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id)
  },
  async asyncData(ctx) {
    if (ctx.app.source === 'zenodo') {
      return {
        artifact: await ctx.app.$zenodoRecordRepository.show(ctx.params.id)
      }
    }
  },
  mounted() {
    this.$axios.setToken(this.$store.state.ZENODO_API_KEY, 'Bearer', [
      'post',
      'delete'
    ])
    this.source = this.$route.query.source || 'zenodo'
    if (this.source == 'kg') {
      this.artifact = testdata[this.$route.params.id]
    }
  }
}
</script>
