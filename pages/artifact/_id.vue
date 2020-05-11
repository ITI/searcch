<template>
  <div>
    <router-link to="/search">Back</router-link>
    <ZenodoArtifactLong :record="record" />
  </div>
</template>

<script>
import ZenodoArtifactLong from '~/components/ZenodoArtifactLong'

export default {
  components: {
    ZenodoArtifactLong
  },
  head() {
    return {
      title: this.record.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.record.title
        }
      ]
    }
  },
  data() {
    return {
      record: {}
    }
  },
  async asyncData(ctx) {
    return {
      record: await ctx.app.$zenodoRecordRepository.show(ctx.params.id)
    }
  },
  mounted() {
    this.$axios.setToken(this.$store.state.ZENODO_API_KEY, 'Bearer', [
      'post',
      'delete'
    ])
  }
}
</script>
