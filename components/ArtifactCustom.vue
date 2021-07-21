<template>
  <div v-if="record.artifact">
    <v-card class="mx-auto my-2">
      <v-card-title>Manual Artifact Submission</v-card-title>
      <v-card-text class="pb-0"
        ><v-text-field
          hide-details
          label="URL"
          outlined
          v-model="meta.url"
        ></v-text-field
      ></v-card-text>
      <v-card-text class="pb-0"
        ><v-text-field
          hide-details
          label="Title"
          outlined
          v-model="meta.title"
        ></v-text-field
      ></v-card-text>

      <v-card-text>
        <div>
          <v-textarea
            hide-details
            auto-grow
            outlined
            label="Description"
            v-model="meta.description"
          ></v-textarea>
        </div>
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
        v-for="(item, index) in meta.creators"
        :key="`c${index}`"
        cols="12"
        class="ma-2"
        label
      >
        <v-icon left>mdi-account-circle</v-icon>
        <v-text-field
          solo
          dark
          placeholder="Enter Creator Name"
          v-model="meta.creators[index]"
          hide-details
          class="m-0"
          background-color="#00476B"
          >{{ meta.creators[index] }}</v-text-field
        >
        <v-icon @click="meta.creators.splice(i, 1)" right>mdi-close</v-icon>
      </v-chip>
      <v-btn @click="meta.creators.push('')" class="success ml-2 mb-2" fab small
        ><v-icon>mdi-plus</v-icon></v-btn
      >

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Keywords</v-card-title>

      <v-chip
        color="primary"
        v-for="(item, index) in meta.keywords"
        :key="`k${index}`"
        cols="12"
        class="ma-2"
        label
      >
        <v-icon left>mdi-tag-outline</v-icon>
        <v-text-field
          solo
          dark
          placeholder="Enter Keyword"
          v-model="meta.keywords[index]"
          hide-details
          class="m-0"
          background-color="#00476B"
          >{{ meta.keywords[index] }}</v-text-field
        >
        <v-icon @click="meta.keywords.splice(index, 1)" right>mdi-close</v-icon>
      </v-chip>
      <v-btn @click="meta.keywords.push('')" class="success ml-2 mb-2" fab small
        ><v-icon>mdi-plus</v-icon></v-btn
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="green" dark @click="save()">
          Save
        </v-btn>

        <v-btn small color="blue" dark @click="publish()">
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
import { artifactIcon, artifactColor } from '@/helpers'
import $RefParser from 'json-schema-ref-parser'
import schemaWithPointers from '~/schema/artifact.json'

export default {
  name: 'ArtifactCustom',
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
      loadingMessage: 'Loading...',
      meta: {
        url: '',
        title: '',
        description: '',
        artifactType: '',
        creators: [],
        keywords: []
      },
      id: null,
      schema: {},
      schemaLoaded: false
    }
  },
  created() {
    $RefParser.dereference(schemaWithPointers, (err, schema) => {
      if (err) {
        console.error(err)
      } else {
        // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
        // including referenced files, combined into a single object
        this.schema = schema
        this.schemaLoaded = true
      }
    })
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
      userid: state => state.user.userid
    }),
    sanitizedDescription: function() {
      return this.$sanitize(this.record.artifact.description)
    },
    types: function() {
      if (this.schemaLoaded) {
        return this.schema.properties.type.enum
      } else return []
    }
  },
  methods: {
    async publish() {
      let response = await this.$artifactRecordEndpoint.put(this.id, {
        publication: {}
      })
      this.$router.push({
        path: 'artifact',
        params: { id }
      })
    },
    async save() {
      console.log(this.meta)
      return
      let response = await this.$artifactsEndpoint.create({
        title: this.title_local,
        description: this.description_local,
        meta: this.meta
      })
      this.id = response.id
      this.snackbar = true
      this.$store.dispatch('artifacts/fetchArtifact', {
        id: this.record.artifact.id
      })
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    }
  }
}
</script>
