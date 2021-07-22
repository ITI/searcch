<template>
  <div v-if="artifact_local">
    <v-card class="mx-auto my-2">
      <v-card-title> {{ artifact_local.title }} </v-card-title>
      <v-card-text>
        <a target="_blank" :href="artifact_local.url">
          {{ artifact_local.url }}
        </a>
      </v-card-text>
    </v-card>
    <v-form v-model="valid">
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
        <v-card-title
          ><v-text-field
            label="URL"
            outlined
            v-model="artifact_local.url"
            :rules="[rules.required, rules.url]"
          ></v-text-field
        ></v-card-title>

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

        <v-card-title class="py-0">Roles</v-card-title>

        <v-chip
          color="primary"
          v-for="(a, index) in artifact_local.affiliations"
          :key="a.id"
          cols="12"
          class="ma-2"
          label
        >
          <span>
            <v-avatar left>
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
            {{ a.affiliation.person.name }} ({{ a.roles }})
            <v-icon @click="artifact_local.affiliations.splice(index, 1)" right
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
          <span>
            <v-avatar left>
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
            {{ meta.creators[index].affiliation.person.name }} ({{
              meta.creators[index].roles
            }})
            <v-icon @click="meta.creators.splice(index, 1)" right
              >mdi-close</v-icon
            >
          </span>
        </v-chip>
        <v-dialog
          transition="dialog-bottom-transition"
          max-width="600px"
          persistent
          v-model="dialog"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="success ml-2 mb-2" fab small v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-card-title>
                <span class="text-h5">Add Author</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-combobox
                        label="Organization Name"
                        small-chips
                        persistent-hint
                        clearable
                        v-if="orgs"
                        :items="orgNames"
                        v-model="affiliation.affiliation.org.name"
                        hint="Select applicable org from the list or type in your own"
                        :search-input.sync="search"
                      >
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>
                                No results matching "<strong>{{
                                  search
                                }}</strong
                                >". Press <kbd>enter</kbd> to create a new one
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-combobox>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Author Name"
                        v-model="affiliation.affiliation.person.name"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Email Address"
                        v-model="affiliation.affiliation.person.email"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  @click="
                    meta.creators.push(affiliation)
                    dialog.value = false
                  "
                  class="success ml-2 mb-2"
                  text
                  >Add</v-btn
                >
                <v-btn
                  class="error ml-2 mb-2"
                  text
                  @click="dialog.value = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <v-divider class="mx-4"></v-divider>

        <v-card-title class="py-0">Keywords</v-card-title>
        <span v-if="artifact_local.tags.length">
          <v-chip
            color="primary"
            v-for="(t, index) in artifact_local.tags"
            :key="`tag${index}`"
            cols="12"
            class="ma-2"
            label
          >
            <v-avatar left>
              <v-icon>mdi-tag-outline</v-icon>
            </v-avatar>
            {{ t.tag }}
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

        <span v-if="meta.languages.length">
          <v-card-title class="py-0">Languages</v-card-title>

          <v-chip
            color="primary"
            v-for="(l, index) in meta.languages"
            :key="`lang${index}`"
            cols="12"
            class="ma-2"
            label
          >
            <v-avatar left>
              <v-icon>{{ iconImage('code') }}</v-icon>
            </v-avatar>
            {{ l }}
            <v-icon @click="meta.languages.splice(index, 1)" right
              >mdi-close</v-icon
            >
          </v-chip>
          <v-divider class="mx-4"></v-divider>
        </span>

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
        <v-dialog
          transition="dialog-bottom-transition"
          persistent
          fullscreen
          v-model="artifactdialog"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="success ml-2 mb-2" fab small v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <template v-slot:default="artifactdialog">
            <v-card>
              <v-card-title>
                <span class="text-h5">Search for Related Artifacts</span>
              </v-card-title>
              <SearchCard :search="search" related />
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="error ml-2 mb-2"
                  text
                  @click="artifactdialog.value = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <v-divider class="mx-4"></v-divider>
        <v-card-title class="py-0">Badges</v-card-title>
        <span v-for="(b, index) in artifact_local.badges">
          <a :href="b.badge.url" target="_blank">
            <v-img
              :key="`badgeimg${index}`"
              max-height="100"
              max-width="100"
              :src="b.badge.image_url"
            />
            {{ b.badge.title }}
          </a>
        </span>

        <v-chip
          v-for="(item, index) in meta.badges"
          :key="`newbadge${index}`"
          cols="12"
          class="ma-2"
          label
        >
          <v-icon left>mdi-tag-outline</v-icon>

          <v-select
            label="Badges"
            v-bind:items="possibleBadges"
            v-model="meta.badges[index]"
            item-text="id"
            item-value="title"
            return-object
          >
            <template slot="item" slot-scope="data">
              <v-list-item-content>
                <v-list-item-title
                  v-html="`${data.item.organization} - ${data.item.title}`"
                >
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <template slot="selection" slot-scope="data">
              {{ data.item.organization }} - {{ data.item.title }}
            </template>
          </v-select>
          <v-icon @click="meta.badges.splice(index, 1)" right>mdi-close</v-icon>
        </v-chip>
        <v-btn @click="meta.badges.push('')" class="success ml-2 mb-2" fab small
          ><v-icon>mdi-plus</v-icon></v-btn
        >

        <v-divider class="mx-4"></v-divider>

        <div v-if="artifact_local.type == 'code'">
          <span v-if="stars || watchers">
            <v-card-title class="py-0">Github Metrics</v-card-title>

            <v-chip color="primary" cols="12" class="ma-2" label>
              <v-avatar left>
                <v-icon color="yellow">mdi-star</v-icon>
              </v-avatar>

              {{ stars }}
            </v-chip>
            <v-chip color="primary" cols="12" class="ma-2" label>
              <v-avatar left>
                <v-icon>mdi-eye</v-icon>
              </v-avatar>

              {{ watchers }}
            </v-chip>
          </span>

          <v-card-title class="py-0">Importer</v-card-title>

          <v-chip color="primary" cols="12" class="ma-2" label>
            <v-avatar left>
              <v-icon>mdi-file-download-outline</v-icon>
            </v-avatar>
            <span v-if="record.artifact.importer">
              {{
                `${record.artifact.importer.name} v${record.artifact.importer.version}`
              }}
            </span>
          </v-chip>

          <span v-if="license">
            <v-card-title v-if="license" class="py-0">License</v-card-title>
            <v-chip color="primary" cols="12" class="ma-2" label>
              <v-avatar left>
                <v-icon>mdi-scale-balance</v-icon>
              </v-avatar>

              {{ license }}
            </v-chip>
          </span>
          <v-divider class="mx-4"></v-divider>
        </div>

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
    </v-form>

    <v-snackbar v-model="snackbar" timeout:3000>
      Artifact Saved
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
import { artifactIcon, artifactColor, bytesToSize } from '@/helpers'
import $RefParser from 'json-schema-ref-parser'
import schemaWithPointers from '~/schema/artifact.json'
import affiliationSchemaWithPointers from '~/schema/affiliation.json'
import { EventBus } from '@/helpers/event-bus.js'
import { zipArray } from '@/helpers'

export default {
  name: 'KGArtifactEdit',
  props: {
    record: {
      type: Object,
      required: true
    },
    create: {
      type: Boolean,
      required: false
    }
  },
  components: {
    LazyHydrate: () => import('vue-lazy-hydration'),
    SearchCard: () => import('@/components/SearchCard')
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
        files: [],
        languages: [],
        relations: [],
        badges: []
      },
      affiliation: {
        affiliation: {
          org: {
            name: '',
            type: 'Institution'
          },
          person: {
            email: '',
            name: ''
          }
        },
        roles: 'Author'
      },
      schema: {},
      affiliationSchema: {},
      schemaLoaded: false,
      valid: false,
      dialog: false,
      artifactdialog: false,
      search: '',
      possibleBadges: [],
      rules: {
        required: value => !!value || 'URL required',
        url: value => {
          let pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g //https://regexr.com/3e6m0
          return pattern.test(value) || 'Invalid URL'
        }
      }
    }
  },
  async created() {
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
    $RefParser.dereference(affiliationSchemaWithPointers, (err, schema) => {
      if (err) {
        console.error(err)
      } else {
        // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
        // including referenced files, combined into a single object
        this.affiliationSchema = schema
        this.schemaLoaded = true
      }
    })
    this.artifact_local = JSON.parse(JSON.stringify(this.record.artifact))
    let csv = this.artifact_local.meta.find(o => o.name == 'languages')
    this.meta.languages = csv ? csv.value.split(',') : []
    this.meta.keywords = this.getPossibleTags()
    let response = await this.$badgesEndpoint.index({ verified: 1 })
    this.possibleBadges = response.badges
  },
  mounted() {
    // force title and description to refresh on page load
    if (this.title && this.description) return true
    setTimeout(() => {
      this.loadingMessage = 'Error loading'
    }, 5000)
    EventBus.$on('close', this.closeHandler)
    this.$store.dispatch('user/fetchOrgs')
  },
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      orgs: state => state.user.orgs
    }),
    orgNames: {
      get: function() {
        return this.orgs.map(m => m.name)
      }
    },
    sanitizedDescription: function() {
      return this.$sanitize(this.artifact_local.description)
    },
    conference() {
      return this.artifact_local.meta.filter(m => m.name == 'conference')
    },
    homepage() {
      let hp = this.artifact_local.meta.find(o => o.name == 'homepage')
      if (!hp) return null
      return hp.value
    },
    stars() {
      let stars = this.artifact_local.meta.find(
        o => o.name == 'stargazers_count'
      )
      if (!stars) return null
      return stars.value
    },
    watchers() {
      let watchers = this.artifact_local.meta.find(
        o => o.name == 'watchers_count'
      )
      if (!watchers) return null
      return watchers.value
    },
    license() {
      let license = this.artifact_local.license
      if (!license) return null
      return license.long_name
    },
    types() {
      if (this.schemaLoaded) {
        return this.schema.properties.type.enum
      } else return []
    },
    orgTypes() {
      if (this.schemaLoaded) {
        return this.affiliationSchema.org.properties.type.enum
      } else return []
    },

    published() {
      if (this.artifact_local.publication) return true
      return false
    }
  },
  watch: {
    record(val) {
      this.artifact_local = JSON.parse(JSON.stringify(val.artifact))
      let csv = this.artifact_local.meta.find(o => o.name == 'languages')
      this.meta.languages = csv ? csv.value.split(',') : []
      this.meta.keywords = this.getPossibleTags()
    }
  },
  methods: {
    async publish() {
      if (!this.valid) return

      let response = await this.$artifactRecordEndpoint.update(
        this.artifact_local.id,
        {
          publication: {}
        }
      )
      this.$router.push(`${this.artifact_local.id}`)
    },
    async save() {
      if (!this.valid) return
      this.artifact_local.tags = this.artifact_local.tags.concat(
        zipArray('tag', this.meta.keywords)
      )
      this.artifact_local.files = this.artifact_local.files.concat(
        this.meta.files
      )
      this.artifact_local.affiliations = this.artifact_local.affiliations.concat(
        this.meta.creators
      )
      this.artifact_local.badges = this.artifact_local.badges.concat(
        zipArray('badge', this.meta.badges)
      )

      let langs = this.artifact_local.meta.find(o => o.name == 'languages')
      if (langs) langs.value = this.meta.languages.join(',')

      console.log('local artifact')
      console.log(this.artifact_local)

      let response = null
      if (this.create) {
        console.log('creating new artifact')
        response = await this.$artifactsEndpoint.create(this.artifact_local)
      } else {
        console.log('curating')
        response = await this.$artifactRecordEndpoint.update(
          this.artifact_local.id,
          this.artifact_local
        )
      }
      console.log('response artifact')
      console.log(response)
      if (response) this.artifact_local = response.artifact
      this.snackbar = true
      this.meta.keywords = this.getPossibleTags()
      this.meta.files = []
      this.meta.creators = []
      this.meta.badges = []
    },
    async addRelated(id) {
      console.log('adding related artifact id' + id)
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    convertSize(size) {
      return bytesToSize(size)
    },
    getPossibleTags() {
      let tags = []
      if (this.artifact_local.tags.length > 0) return []
      let top = this.artifact_local.meta
        ? this.artifact_local.meta.find(o => o.name == 'top_keywords')
        : null
      if (top) {
        tags = tags.concat(JSON.parse(top.value).map(e => e[0]))
      }
      top = this.artifact_local.meta
        ? this.artifact_local.meta.find(o => o.name == 'top_ngram_keywords')
        : null
      if (top) {
        tags = tags.concat(JSON.parse(top.value).map(e => e[0]))
      }
      // return only unique
      let t = [...new Set(tags)]
      t = t.filter(el => !this.artifact_local.tags.map(e => e.tag).includes(el))
      return t
    },
    closeHandler(dialog) {
      switch (dialog) {
        case 'artifactdialog': {
          this.artifactdialog = false
        }
      }
    }
  }
}
</script>
