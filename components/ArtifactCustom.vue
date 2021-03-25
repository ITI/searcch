<template>
  <div v-if="record.artifact">
    <v-card class="mx-auto my-2">
      <v-card-title>Custom Artifact Import</v-card-title>
      <v-card-text class="pb-0"><v-text-field hide-details label="URL" outlined v-model="meta.url"></v-text-field></v-card-text>
      <v-card-text class="pb-0"><v-text-field hide-details label="Title" outlined v-model="meta.title"></v-text-field></v-card-text>
      
      <v-card-text>
        <div><v-textarea hide-details auto-grow outlined label="Description" v-model="meta.description"></v-textarea></div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0 mt-2"> Artifact Type </v-card-title>

      <v-select 
        :items="types"
        label="Select Artifact Type"
        class="mx-4"
        chips
        v-model="meta.artifactType"
      ></v-select>

      <v-card-title class="py-0">Creators</v-card-title>

      <v-chip
        color="primary"
        v-for="(c,i) in meta.creators"
        :key="`c${i}`"
        cols="12"
        class="ma-2"
        label
      >
        <v-icon left>mdi-account-circle</v-icon>
        <v-text-field 
          solo
          dark
          placeholder="Enter Creator Name"
          v-model="meta.creators[i]"
          hide-details
          class="m-0"
          background-color="#00476B"
        >{{ c }}</v-text-field>
        <v-icon @click="meta.creators.splice(i,1)" right>mdi-close</v-icon>
      </v-chip>
      <v-btn @click="meta.creators.push('')" class="success ml-2 mb-2" fab small><v-icon>mdi-plus</v-icon></v-btn>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Keywords</v-card-title>
      
      <v-chip
        color="primary"
        v-for="(c,i) in meta.keywords"
        :key="`k${i}`"
        cols="12"
        class="ma-2"
        label
      >
        <v-icon left>mdi-tag-outline</v-icon>
        <v-text-field 
          solo
          dark
          placeholder="Enter Keyword"
          v-model="meta.keywords[i]"
          hide-details
          class="m-0"
          background-color="#00476B"
        >{{ c }}</v-text-field>
        <v-icon @click="meta.keywords.splice(i,1)" right>mdi-close</v-icon>
      </v-chip>
      <v-btn @click="meta.keywords.push('')" class="success ml-2 mb-2" fab small><v-icon>mdi-plus</v-icon></v-btn>


      <v-divider class="mx-4"></v-divider>
      
      <v-card-title class="py-0">Related</v-card-title>
      
      <v-chip
        color="primary"
        v-for="(c,i) in meta.related"
        :key="`r${i}`"
        cols="12"
        class="ma-2"
        label
      >
        <v-icon left>mdi-relation-one-to-one</v-icon>
        <v-text-field 
          solo
          dark
          placeholder="Enter Artifact Id"
          v-model="meta.related[i]"
          hide-details
          class="m-0"
          background-color="#00476B"
        >{{ c }}</v-text-field>
        <v-icon @click="meta.related.splice(i,1)" right>mdi-close</v-icon>
      </v-chip>
      <v-btn @click="meta.related.push('')" class="success ml-2 mb-2" fab small><v-icon>mdi-plus</v-icon></v-btn>


      <v-divider class="mx-4"></v-divider>
      
      <v-card-title class="py-0">Badges</v-card-title>
      <v-chip
        color="primary"
        v-for="(c,i) in meta.badges"
        :key="`b${i}`"
        cols="12"
        class="ma-2"
        label
      >
        <v-icon left>mdi-check-decagram</v-icon>
        <v-text-field 
          solo
          dark
          placeholder="Enter Badge Name"
          v-model="meta.badges[i]"
          hide-details
          class="m-0"
          background-color="#00476B"
        >{{ c }}</v-text-field>
        <v-icon @click="meta.badges.splice(i,1)" right>mdi-close</v-icon>
      </v-chip>
      <v-btn @click="meta.badges.push('')" class="success ml-2 mb-2" fab small><v-icon>mdi-plus</v-icon></v-btn>


      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Files</v-card-title>

      <v-card-text v-for="(v, k) in record.artifact.files" :key="`file${k}`" cols="12">
        <div>
          <a target="_blank" :href="v.url">{{ v.url }}</a> &nbsp; (type: {{ v.filetype }}, size: {{ bytesToSize(v.size) }})
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="save()" text>
          Save
        </v-btn>
        <v-btn @click="publish()" text>
          Publish
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="snackbar"
    >
      Title and description saved
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
  <!-- The loading is needed because otherwise the var dereferences above would cause a failure to load if the data is not available yet -->
  <div v-else>
    {{ loadingMessage }}
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'KGArtifactLong',
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      publish_local: false,
      title_local: this.title,
      description_local: this.description,
      snackbar: false,
      loadingMessage: "Loading...",
      meta: {
        url: '',
        title: '',
        description: '',
        artifactType: '',
        creators: [],
        keywords: [],
        related: [],
        badges: [],
      },
      types: [
        'Dataset',
        'Publication',
        'Code',
        'Executable',
        'Methodology',
        'Metrics',
        'Hypothesis',
        'Domain',
        'Supporting Info',
        'Prior Work',
      ],
    }
  },
  mounted () {
    // force title and description to refresh on page load
    if (this.title && this.description) return true
    setTimeout(() => {
      this.loadingMessage = "Error loading"
    }, 5000)
  },
  computed: {
    ...mapState({
      source: state => state.artifacts.source,
      user_id: state => state.user.user_id,
      favorites: state => state.artifacts.favoritesIDs
    }),
    sanitizedDescription: function() {
      return this.$sanitize(this.record.artifact.description)
    },
    favorite: {
      get () {
        return this.favorites[this.record.artifact.id] ? true : false
      },
      set (value) {
        if (value) this.$store.commit('artifacts/ADD_FAVORITE', this.record.artifact.id)
        else this.$store.commit('artifacts/REMOVE_FAVORITE', this.record.artifact.id)
      }
    },
    badges () {
      let badges = []
      let badges_raw = this.record.artifact.meta.filter(m => m.name == "badge")
      if (!badges_raw.length) return null
      for (let b of badges_raw) {
        badges.push(JSON.parse(b.value))
      }
      return badges
    },
    artifactIcon () {
      if (this.record.artifact.type == "publication") return "mdi-newspaper-variant-outline"
      if (this.record.artifact.type == "dataset") return "mdi-database"
    },
    artifactColor () {
      if (this.record.artifact.type == "publication") return "info"
      if (this.record.artifact.type == "dataset") return "green white--text"
    },
  },
  methods: {
    async publish () {
      let response = await this.$artifactRecordRepository.put(this.record.artifact.id, {
        publication: {},
      })
      this.$router.push(`${this.record.artifact.id}`)
    },
    async save () {
      let response = await this.$artifactRecordRepository.put(this.record.artifact.id, {
        title: this.title_local,
        description: this.description_local,
      })
      this.snackbar = true
      this.$store.dispatch('artifacts/fetchArtifact', {
        id: this.record.artifact.id,
        source: 'kg'
      })
    },
    bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes == 0) return '0 Bytes'
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    },
  }
}
</script>
