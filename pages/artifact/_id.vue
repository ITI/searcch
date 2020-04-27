<template>
  <div>
    <div v-if="record" id="record">
      <v-card>
        <v-card-title>
          Zenodo Artifact {{ record.id }}
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
          :items-per-page="15"
          :search="search"
          :hide-default-header="true"
          class="elevation-2"
        >
          <template v-slot:item.value="{ item }">
            {{
              typeof item.value === 'object'
                ? JSON.stringify(item.value)
                : item.value
            }}
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      title: 'Artifact View',
      id: this.$route.params.id,
      record: {},
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Value', value: 'value' }
      ]
    }
  },
  computed: {
    entries() {
      var entries = []
      for (var key of Object.keys(this.record)) {
        entries.push({ name: key, value: this.record[key] })
        console.log(key)
      }
      return entries
    }
  },
  mounted() {
    this.$axios
      .get(`https://zenodo.org/api/records/${this.id}`)
      .then(response => {
        this.record = response.data
      })
  }
}
</script>

<style scoped></style>
