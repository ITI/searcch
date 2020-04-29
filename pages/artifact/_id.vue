<template>
  <div>
    <div v-if="record" id="record">
      <v-card>
        <v-card-title>
          Zenodo Artifact &nbsp;
          <a :href="zenodoURL" target="_blank">{{ record.id }}</a>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="entries"
          :search="search"
          :hide-default-header="true"
          :expanded.sync="expanded"
          :items-per-page="15"
          :custom-filter="filterAll"
          item-key="name"
          show-expand
          class="elevation-2"
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <pre>
                {{ item.value }}
              </pre>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
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
    this.$axios.setToken(process.env.ZENODO_API_KEY, 'Bearer', [
      'post',
      'delete'
    ])
    this.$axios
      .get(process.env.ZENODO_API_URL + `records/${this.id}`)
      .then(response => {
        this.record = response.data
        this.zenodoURL = 'https://zenodo.org/record/' + response.data.id
      })
  }
}
</script>

<style scoped></style>
