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
      search: '',
      id: this.$route.params.id,
      record: {}
    }
  },
  mounted() {
    this.$axios.setToken(this.$store.state.ZENODO_API_KEY, 'Bearer', [
      'post',
      'delete'
    ])
    this.$axios
      .get(this.$store.state.ZENODO_API_URL + `records/${this.id}`)
      .then(response => {
        this.record = response.data
      })
  }
}
</script>
