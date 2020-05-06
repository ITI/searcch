<template>
  <div>
    <router-link to="/search">Back</router-link>
    <zenodoartifact :record="record" />
  </div>
</template>

<script>
import zenodoartifact from '~/components/zenodoartifact'

export default {
  components: {
    zenodoartifact
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
