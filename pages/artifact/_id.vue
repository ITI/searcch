<template>
  <div v-if="record" id="record">
    <router-link to="/search">Back</router-link>
    <h1>
      Zenodo Artifact
      <a :href="zenodoURL" target="_blank">{{ record.id }}</a>
    </h1>
    <zenodoartifact v-if="record" :record="record" />
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
      record: {},
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Value', value: 'value' }
      ],
      expanded: [],
      zenodoURL: ''
    }
  },
  methods: {
    filterAll(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().indexOf(search) !== -1
      )
    }
  },
  computed: {
    entries() {
      var entries = []
      for (var key of Object.keys(this.record)) {
        if (typeof this.record[key] === 'object') {
          entries.push({
            name: key,
            value: JSON.stringify(this.record[key], undefined, 2)
          })
        } else {
          entries.push({ name: key, value: this.record[key] })
        }
      }
      return entries
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
        this.zenodoURL = 'https://zenodo.org/record/' + response.data.id
      })
  }
}
</script>

<style scoped></style>
