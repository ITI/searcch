<template>
  <div v-if="record.artifact">
    <v-banner
      class="my-4"
      elevation="6"
      icon="mdi-alert-circle"
      icon-color="red"
      color="yellow darken-2"
    >
      Editing the metadata fields of the artifacts are unavailable during the
      beta release. This page has been provided as a possible design for such a
      feature. <br />
      All the button and input functionality has been purposely disabled. Please
      send us feedback on this design.
    </v-banner>
    <h3>
      <a target="_blank" :href="record.artifact.url">
        Knowledge Graph Artifact {{ record.artifact.id }}
      </a>
    </h3>
    <v-card class="mx-auto my-2">
      <v-card-title
        ><v-text-field
          label="Title"
          outlined
          v-model="title_local"
        ></v-text-field
      ></v-card-title>

      <v-card-text>
        <div>
          <v-textarea
            auto-grow
            outlined
            label="Description"
            v-model="description_local"
          ></v-textarea>
        </div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0"> Artifact Type </v-card-title>

      <v-chip :color="artifactColor" class="ma-2" label>
        <v-avatar left>
          <v-icon>{{ artifactIcon(record.artifact.type) }}</v-icon>
        </v-avatar>

        <div>{{ record.artifact.type }}</div>
      </v-chip>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Creators</v-card-title>

      <v-chip
        color="primary"
        v-for="c in record.artifact.affiliations"
        :key="c.id"
        cols="12"
        class="ma-2"
        label
      >
        <span v-if="c.affiliation.roles == 'Author'">
          <v-icon left>mdi-account-circle</v-icon>
          {{ c.affiliation.person.name }}
          <v-icon right>mdi-close</v-icon>
        </span>
      </v-chip>
      <v-btn class="success ml-2 mb-2" fab small disabled
        ><v-icon>mdi-plus</v-icon></v-btn
      >

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Keywords</v-card-title>
      <span v-if="record.artifact.tags.length">
        <v-chip
          color="primary"
          v-for="(v, k) in record.artifact.tags"
          :key="`tag${k}`"
          cols="12"
          class="ma-2"
          label
          :to="{ path: `/search?keywords=${v.tag}` }"
        >
          <v-avatar left>
            <v-icon>mdi-tag-outline</v-icon>
          </v-avatar>

          {{ v.tag }}
        </v-chip>
      </span>
      <v-btn class="success ml-2 mb-2" fab small disabled
        ><v-icon>mdi-plus</v-icon></v-btn
      >

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Related</v-card-title>
      <span v-if="record.artifact.relationships.length">
        <v-chip
          color="primary"
          v-for="(v, k) in record.artifact.relationships"
          :key="`rel${k}`"
          cols="12"
          class="ma-2"
          label
          :to="{ path: `/artifact/${v.related_artifact_id}` }"
        >
          <v-icon left>mdi-relation-one-to-one</v-icon>

          {{ v.relation | titlecase }}: {{ v.related_artifact }}
        </v-chip>
      </span>
      <v-btn class="success ml-2 mb-2" fab small disabled
        ><v-icon>mdi-plus</v-icon></v-btn
      >

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Badges</v-card-title>
      <span v-if="badges">
        <v-chip
          color="primary"
          v-for="(v, k) in badges"
          :key="`bad${k}`"
          cols="12"
          class="ma-2"
          label
          :href="v.url"
          target="_blank"
        >
          <v-icon left>mdi-check-decagram</v-icon>
          {{ v.title }}
        </v-chip>
      </span>
      <v-btn class="success ml-2 mb-2" fab small disabled
        ><v-icon>mdi-plus</v-icon></v-btn
      >

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Files</v-card-title>
      <span v-if="record.artifact.files.length">
        <v-card-text
          v-for="(v, k) in record.artifact.files"
          :key="`file${k}`"
          cols="12"
        >
          <div>
            <a target="_blank" :href="v.url">{{ v.url }}</a> &nbsp; (type:
            {{ v.filetype }}, size: {{ bytesToSize(v.size) }})
          </div>
        </v-card-text>
      </span>
      <span class="ml-4 mb-2" v-else>Importer found no files</span>

      <v-card-actions>
        <v-btn @click="save()" text>
          Save
        </v-btn>
        <v-btn @click="publish()" text>
          Publish
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar">
      Title and description saved
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
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
      loadingMessage: 'Loading...'
    }
  },
  mounted() {
    // force title and description to refresh on page load
    if (this.title && this.description) return true
    setTimeout(() => {
      this.loadingMessage = 'Error loading'
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
      get() {
        return this.favorites[this.record.artifact.id] ? true : false
      },
      set(value) {
        if (value)
          this.$store.commit('artifacts/ADD_FAVORITE', this.record.artifact.id)
        else
          this.$store.commit(
            'artifacts/REMOVE_FAVORITE',
            this.record.artifact.id
          )
      }
    },
    badges() {
      let badges = []
      let badges_raw = this.record.artifact.meta.filter(m => m.name == 'badge')
      if (!badges_raw.length) return null
      for (let b of badges_raw) {
        badges.push(JSON.parse(b.value))
      }
      return badges
    },
    published() {
      if (this.record.artifact.publication) return true
      return false
    },
    title() {
      this.title_local = this.record.artifact.title
      return this.record.artifact.title
    },
    description() {
      this.description_local = this.record.artifact.description
      return this.record.artifact.description
    }
  },
  methods: {
    async publish() {
      let response = await this.$artifactRecordRepository.put(
        this.record.artifact.id,
        {
          publication: {}
        }
      )
      this.$router.push(`${this.record.artifact.id}`)
    },
    async save() {
      let response = await this.$artifactRecordRepository.put(
        this.record.artifact.id,
        {
          title: this.title_local,
          description: this.description_local
        }
      )
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
    artifactIcon(type) {
      switch (type) {
        case 'publication':
          return 'mdi-newspaper-variant-outline'
        case 'dataset':
          return 'mdi-database'
        case 'code':
          return 'mdi-code-braces'
        default:
          return 'mdi-help'
      }
    },
    artifactColor(type) {
      switch (type) {
        case 'publication':
          return 'info'
        case 'dataset':
          return 'green white--text'
        case 'code':
          return 'purple white--text'
        default:
          return 'info'
      }
    }
  }
}
</script>
