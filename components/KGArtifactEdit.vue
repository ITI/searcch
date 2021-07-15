<template>
  <LazyHydrate when-visible>
    <div>
      <div v-if="artifact_local">
        <h3>
          <a target="_blank" :href="artifact_local.url">
            Artifact {{ artifact_local.id }}
          </a>
        </h3>
        <v-card class="mx-auto my-2">
          <v-card-title
            ><v-text-field
              label="Title"
              outlined
              v-model="artifact_local.title"
            ></v-text-field
          ></v-card-title>
          <v-card-text>
            <div>
              <v-textarea
                auto-grow
                outlined
                label="Description"
                v-model="artifact_local.description"
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
            v-model="artifact_local.type"
            :prepend-icon="iconImage(artifact_local.type)"
            :color="iconColor(artifact_local.type)"
          ></v-select>

          <v-divider class="mx-4"></v-divider>

          <v-card-title class="py-0">Creators</v-card-title>

          <v-chip
            color="primary"
            v-for="(a, index) in artifact_local.affiliations"
            :key="a.id"
            cols="12"
            class="ma-2"
            label
          >
            <span v-if="a.affiliation.roles == 'Author'">
              <v-icon left>mdi-account-circle</v-icon>
              {{ a.affiliation.person.name }}
              <v-icon
                @click="artifact_local.affiliations.splice(index, 1)"
                right
                >mdi-close</v-icon
              >
            </span>
          </v-chip>

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
            <v-icon @click="meta.creators.splice(index, 1)" right
              >mdi-close</v-icon
            >
          </v-chip>
          <v-btn
            @click="meta.creators.push('')"
            class="success ml-2 mb-2"
            fab
            small
            ><v-icon>mdi-plus</v-icon></v-btn
          >

          <v-divider class="mx-4"></v-divider>

          <span v-if="tags">
            <v-card-title class="py-0">Keywords</v-card-title>

            <v-chip
              color="primary"
              v-for="(t, index) in tags"
              :key="t"
              cols="12"
              class="ma-2"
              label
            >
              <v-avatar left>
                <v-icon>mdi-tag-outline</v-icon>
              </v-avatar>
              {{ t }}
              <v-icon @click="artifact_local.tags.splice(index, 1)" right
                >mdi-close</v-icon
              >
            </v-chip>
          </span>

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
            <v-icon @click="meta.keywords.splice(index, 1)" right
              >mdi-close</v-icon
            >
          </v-chip>
          <v-btn
            @click="meta.keywords.push('')"
            class="success ml-2 mb-2"
            fab
            small
            ><v-icon>mdi-plus</v-icon></v-btn
          >

          <v-divider class="mx-4"></v-divider>

          <v-card-title class="py-0">Related</v-card-title>
          <span v-if="artifact_local.relationships">
            <v-chip
              color="primary"
              v-for="(v, k) in artifact_local.relationships"
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
          <v-btn class="success ml-2 mb-2" fab small
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
          <v-btn class="success ml-2 mb-2" fab small
            ><v-icon>mdi-plus</v-icon></v-btn
          >

          <v-divider class="mx-4"></v-divider>

          <v-card-title class="py-0">Files</v-card-title>
          <span v-if="artifact_local.files">
            <v-card-text
              v-for="(f, index) in artifact_local.files"
              :key="`file${index}`"
              cols="12"
            >
              <div>
                <v-icon left>mdi-file</v-icon>
                <a target="_blank" :href="f.url">{{ f.url }}</a>
                &nbsp; (type: {{ f.filetype ? f.filetype : 'unknown' }}, size:
                {{ f.size ? convertSize(f.size) : 'unknown' }})
                <v-icon @click="artifact_local.files.splice(index, 1)" right
                  >mdi-close</v-icon
                >
              </div>
            </v-card-text>
            <v-card-text
              v-for="(f, index) in meta.files"
              :key="`newfile${index}`"
              cols="12"
            >
              <v-textarea
                outlined
                height="10"
                label="File URL"
                placeholder="Enter File URL"
                v-model="f.url"
                prepend-icon="mdi-file"
                append-outer-icon="mdi-close"
                @click:append-outer="meta.files.splice(index, 1)"
              ></v-textarea>
            </v-card-text>
            <v-btn
              @click="meta.files.push({ url: '' })"
              class="success ml-2 mb-2"
              fab
              small
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </span>
          <span class="ml-4 mb-2" v-else>No files found by importer</span>

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
    </div>
  </LazyHydrate>
</template>

<script>
import { mapState } from 'vuex'
import { artifactIcon, artifactColor, bytesToSize } from '@/helpers'
import $RefParser from 'json-schema-ref-parser'
import schemaWithPointers from '~/schema/artifact.json'
import LazyHydrate from 'vue-lazy-hydration'

export default {
  name: 'KGArtifactLong',
  props: {
    record: {
      type: Object,
      required: true
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
  data() {
    return {
      loading: true,
      publish_local: false,
      snackbar: false,
      loadingMessage: 'Loading...',
      artifact_local: {},
      meta: {
        creators: [],
        keywords: [],
        files: []
      },
      schema: {},
      schemaLoaded: false
    }
  },
  mounted() {
    this.artifact_local = JSON.parse(JSON.stringify(this.record.artifact))
    console.log(this.artifact_local)
    // force title and description to refresh on page load
    if (this.title && this.description) return true
    setTimeout(() => {
      this.loadingMessage = 'Error loading'
    }, 5000)
  },
  computed: {
    ...mapState({
      source: state => state.artifacts.source,
      userid: state => state.user.userid,
      favorites: state => state.artifacts.favoritesIDs
    }),
    sanitizedDescription: function() {
      return this.$sanitize(this.artifact_local.description)
    },
    favorite: {
      get() {
        return this.favorites[this.artifact_local.id] ? true : false
      },
      set(value) {
        if (value)
          this.$store.commit('artifacts/ADD_FAVORITE', this.artifact_local.id)
        else
          this.$store.commit(
            'artifacts/REMOVE_FAVORITE',
            this.artifact_local.id
          )
      }
    },
    badges() {
      let badges = []
      let badges_raw = this.artifact_local.meta
        ? this.artifact_local.meta.filter(m => m.name == 'badge')
        : null
      if (!badges_raw) return null
      for (let b of badges_raw) {
        badges.push(JSON.parse(b.value))
      }
      return badges
    },
    tags() {
      let tags = []
      if (this.artifact_local.tags) {
        tags = this.artifact_local.tags.map(e => e.tag)
      }
      let topics = this.artifact_local.meta
        ? this.artifact_local.meta.find(o => o.name == 'top_keywords')
        : null
      if (topics) {
        tags = tags.concat(JSON.parse(topics.value).map(e => e[0]))
      }
      return tags.filter((value, index, self) => self.indexOf(value) === index)
    },
    types() {
      if (this.schemaLoaded) {
        return this.schema.properties.type.enum
      } else return []
    },
    published() {
      if (this.artifact_local.publication) return true
      return false
    }
  },
  methods: {
    async publish() {
      let response = await this.$artifactRecordRepository.put(
        this.artifact_local.id,
        {
          publication: {}
        }
      )
      this.$router.push(`${this.artifact_local.id}`)
    },
    async save() {
      let zip = [['tag']]
      this.meta.keywords.map(e => zip.push([e]))
      console.log(this.meta.keywords)
      const mapWith = keys => values =>
          Object.fromEntries(keys.map((k, i) => [k, values[i]])),
        getArray = ([keys, ...zip]) => zip.map(mapWith(keys)),
        array = getArray(zip)

      this.artifact_local['tags'] = this.artifact_local['tags'].concat(array)
      this.artifact_local['files'] = this.artifact_local['files'].concat(
        this.meta.files
      )

      console.log(this.artifact_local)
      this.meta.keywords = []
      this.meta.files = []

      return
      let response = await this.$artifactRecordRepository.put(
        this.artifact_local.id,
        {
          title: this.title_local,
          description: this.description_local
        }
      )
      this.snackbar = true
      this.$store.dispatch('artifacts/fetchArtifact', {
        id: this.artifact_local.id,
        source: 'kg'
      })
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    convertSize(size) {
      return bytesToSize(size)
    }
  }
}
</script>
