<template>
  <div v-if="artifact_local">
    <div>
      <v-card class="mx-auto my-2">
        <v-card-title> {{ artifact_local.title | titlecase }} </v-card-title>
        <v-card-text>
          <a target="_blank" :href="artifact_local.url" rel="noopener">
            {{ artifact_local.url }}
          </a>
        </v-card-text>
      </v-card>
    </div>
    <v-form v-model="valid" ref="artifact">
      <v-card class="mx-auto my-2">
        <v-card-title
          ><v-text-field
            label="Title"
            outlined
            v-model="artifact_local.title"
            :rules="[rules.required, rules.exists]"
            required
          ></v-text-field
        ></v-card-title>
        <v-card-text>
          <div>
            <v-textarea
              auto-grow
              outlined
              label="Description"
              v-model="artifact_local.description"
              :rules="[rules.required, rules.exists]"
              required
            ></v-textarea>
          </div>
        </v-card-text>
        <v-card-title
          ><v-text-field
            label="URL"
            outlined
            v-model="artifact_local.url"
            :rules="[rules.required, rules.url]"
            required
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
          :rules="[rules.required, rules.exists]"
          required
        ></v-select>

        <v-divider class="mx-4"></v-divider>

        <v-card-title class="py-0">Authors</v-card-title>

        <ArtifactChips
          :field="artifact_local.affiliations"
          type="role"
          edit
        ></ArtifactChips>

        <ArtifactChips :field="meta.creators" type="role" edit></ArtifactChips>
        <div>
          <v-dialog
            transition="dialog-bottom-transition"
            max-width="600px"
            persistent
            v-model="dialog"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="success ml-2 mb-2"
                fab
                x-small
                v-bind="attrs"
                v-on="on"
              >
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
                          v-model="affiliation.affiliation.org"
                          hint="Select applicable organization from the list or type in your own"
                          :search-input.sync="search"
                          item-value="org.name"
                          item-text="org.name"
                          return-object
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
                      affiliation = affiliationObject()
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
        </div>

        <v-divider class="mx-4"></v-divider>

        <v-card-title class="py-0">Keywords</v-card-title>
        <ArtifactChips
          :field="artifact_local.tags"
          type="keyword"
          edit
        ></ArtifactChips>

        <ArtifactChips
          :field="meta.keywords"
          type="keyword"
          placeholder="Enter Keyword"
          edit
          create
        ></ArtifactChips>

        <v-divider class="mx-4"></v-divider>

        <v-card-title class="py-0">Languages</v-card-title>
        <ArtifactChips
          :field="meta.languages"
          type="software"
          placeholder="Enter Language"
          edit
          create
        ></ArtifactChips>

        <v-divider class="mx-4"></v-divider>

        <v-card-title class="py-0">Related</v-card-title>

        <ArtifactChips
          :field="artifact_local.relationships"
          type="relation"
          edit
        ></ArtifactChips>

        <div>
          <v-dialog
            transition="dialog-bottom-transition"
            persistent
            fullscreen
            v-model="artifactdialog"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="success ml-2 mb-2"
                fab
                x-small
                v-bind="attrs"
                v-on="on"
                :disabled="artifact_local.id ? false : true"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <template v-slot:default="artifactdialog">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Search for Related Artifacts</span>
                </v-card-title>
                <SearchCard :search="search" related all></SearchCard>
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
        </div>
        <v-divider class="mx-4"></v-divider>

        <v-card-title class="py-0">Badges</v-card-title>
        <div>
          <span v-for="(b, index) in artifact_local.badges">
            <v-img
              :key="`badgeimg${index}`"
              max-height="100"
              max-width="100"
              :src="b.badge.image_url"
            ></v-img>
            <a :href="b.badge.url" target="_blank" rel="noopener">
              {{ b.badge.title }}
            </a>
            <v-icon @click="artifact_local.badges.splice(index, 1)" right
              >mdi-close</v-icon
            >
          </span>
        </div>
        <div>
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
                    v-text="`${data.item.organization} - ${data.item.title}`"
                  >
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <template slot="selection" slot-scope="data">
                {{ data.item.organization }} - {{ data.item.title }}
              </template>
            </v-select>
            <v-icon @click="meta.badges.splice(index, 1)" right
              >mdi-close</v-icon
            >
          </v-chip>
          <v-btn
            @click="meta.badges.push('')"
            class="success ml-2 mb-2"
            fab
            x-small
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </div>

        <v-divider class="mx-4"></v-divider>

        <div v-if="artifact_local.type == 'software'">
          <div v-if="stars || watchers">
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
          </div>

          <div v-if="record.artifact.importer">
            <v-card-title class="py-0">Importer</v-card-title>

            <v-chip color="primary" cols="12" class="ma-2" label>
              <v-avatar left>
                <v-icon>mdi-file-download-outline</v-icon>
              </v-avatar>
              {{
                `${record.artifact.importer.name} v${record.artifact.importer.version}`
              }}
            </v-chip>
            <v-divider class="mx-4"></v-divider>
          </div>
        </div>

        <v-card-title class="py-0">License</v-card-title>
        <v-chip cols="12" class="ma-2" label>
          <v-icon left>mdi-scale-balance</v-icon>

          <v-autocomplete
            label="License"
            :items="possibleLicenses"
            v-model="artifact_local.license"
            item-text="short_name"
            item-value="long_name"
            return-object
          >
            <template slot="item" slot-scope="data">
              <v-list-item-content>
                <v-list-item-title
                  v-text="`${data.item.short_name} (${data.item.long_name})`"
                >
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <template slot="selection" slot-scope="data">
              {{ data.item.short_name }} ({{ data.item.long_name }})
            </template>
          </v-autocomplete>
          <v-icon @click="artifact_local.license = []" right>mdi-close</v-icon>
        </v-chip>
        <v-divider class="mx-4"></v-divider>

        <v-card-title class="py-0">Files</v-card-title>

        <div v-if="artifact_local.files">
          <v-list-item
            v-for="(f, index) in artifact_local.files"
            :key="`file${index}`"
            dense
          >
            <v-list-group :value="true" no-action sub-group>
              <template v-slot:activator>
                <a @click.stop target="_blank" :href="f.url" rel="noopener">{{
                  f.url
                }}</a>
                &nbsp; (type: {{ f.filetype ? f.filetype : 'unknown' }}, size:
                {{ f.size ? convertSize(f.size) : 'unknown' }})
              </template>
              <v-list-item
                v-for="(fm, indexm) in f.members"
                :key="`mem${indexm}`"
                dense
              >
                <a
                  target="_blank"
                  :href="fm.html_url || fm.download_url"
                  rel="noopener"
                  >{{
                    fm.pathname || fm.name || fm.html_url || fm.download_url
                  }}</a
                >
                &nbsp; (type: {{ fm.filetype ? fm.filetype : 'unknown' }}, size:
                {{ fm.size ? convertSize(fm.size) : 'unknown' }})
              </v-list-item>
            </v-list-group>
            <v-icon @click="artifact_local.files.splice(index, 1)" right
              >mdi-close</v-icon
            >
          </v-list-item>

          <div>
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
              @click="meta.files.push({ url: '', filetype: 'unknown' })"
              class="success ml-2 mb-2"
              fab
              x-small
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </div>
        </div>
        <div class="ml-4 mb-2" v-else>No files found by importer</div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" :disabled="!valid || disabled" @click="save()">
            Save
          </v-btn>

          <v-btn
            color="primary"
            :disabled="!valid || disabled"
            @click="publish()"
          >
            Publish
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>

    <v-snackbar v-model="snackbar" timeout:3000>
      Artifact Saved
      <template v-slot:action="{ attrs }">
        <v-btn color="error" text v-bind="attrs" @click="snackbar = false">
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
import { zipArray, EventBus } from '@/helpers'

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
    SearchCard: () => import('@/components/SearchCard'),
    ArtifactChips: () => import('@/components/ArtifactChips')
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
      affiliation: this.affiliationObject(),
      schema: {},
      affiliationSchema: {},
      schemaLoaded: false,
      valid: true,
      dialog: false,
      disabled: false,
      artifactdialog: false,
      search: '',
      possibleBadges: [],
      possibleLicenses: [],
      rules: {
        required: value => !!value || 'required',
        exists: value => {
          return typeof value === 'string' ? value.length > 0 : false
        },
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
    this.meta.languages = this.getLanguages()
    this.meta.keywords = this.getPossibleTags()
    let response = await this.$badgesEndpoint.index({ verified: 1 })
    this.possibleBadges = typeof response !== 'undefined' ? response.badges : []
    response = await this.$licenseEndpoint.index({ verified: 1, all: 1 })
    this.possibleLicenses =
      typeof response !== 'undefined' ? response.licenses : []
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
      return license.short_name + ' (' + license.long_name + ')'
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
      this.meta.languages = this.getLanguages()
      this.meta.keywords = this.getPossibleTags()
    },
    artifact_local(val) {
      this.meta.languages = this.getLanguages()
      this.meta.keywords = this.getPossibleTags()
    }
  },
  methods: {
    async publish() {
      if (!this.valid) return
      if (!confirm('Are you sure you want to publish this artifact?')) return

      // save the artifact first
      await this.save()

      let response = await this.$artifactEndpoint.update(
        this.artifact_local.id,
        {
          publication: {}
        }
      )
      this.$store.dispatch('artifacts/fetchArtifact', {
        id: this.artifact_local.id
      })

      this.$router.push(`/artifact/${this.artifact_local.id}`)
    },
    async save() {
      if (!this.valid) return
      this.disabled = true

      // tags
      this.artifact_local.tags =
        typeof this.artifact_local.tags !== 'undefined' &&
        this.artifact_local.tags !== null
          ? this.artifact_local.tags.concat(zipArray('tag', this.meta.keywords))
          : zipArray('tag', this.meta.keywords)

      // files
      this.artifact_local.files =
        typeof this.artifact_local.files !== 'undefined' &&
        this.artifact_local.files !== null
          ? this.artifact_local.files.concat(this.meta.files)
          : this.meta.files

      // process affiliations
      this.meta.creators.forEach((affil, index, object) => {
        if (typeof affil.affiliation.org === 'string') {
          let org = this.orgs.find(a => a.name === affil.affiliation.org)
          if (typeof org !== 'undefined') {
            affil.affiliation.org = JSON.parse(JSON.stringify(org))
          } else {
            affil.affiliation.org = {
              name: affil.affiliation.org,
              type: 'Institution'
            }
          }
        }
      })
      this.artifact_local.affiliations =
        typeof this.artifact_local.affiliations !== 'undefined' &&
        this.artifact_local.affiliations !== null
          ? this.artifact_local.affiliations.concat(this.meta.creators)
          : this.meta.creators

      // badges
      this.artifact_local.badges =
        typeof this.artifact_local.badges !== 'undefined' &&
        this.artifact_local.badges !== null
          ? this.artifact_local.badges.concat(
              zipArray('badge', this.meta.badges)
            )
          : zipArray('badge', this.meta.badges)

      // languages
      let langs =
        this.artifact_local.meta !== null
          ? this.artifact_local.meta.find(o => o.name == 'languages')
          : null
      if (langs) {
        if (this.meta.languages.join(',')) {
          langs.value = this.meta.languages.join(',')
        } else {
          this.artifact_local.meta.splice(
            this.artifact_local.meta.findIndex(o => o.name == 'languages'),
            1
          )
        }
      } else {
        if (this.meta.languages.join(',')) {
          this.artifact_local.meta.push({
            name: 'languages',
            value: this.meta.languages.join(',')
          })
        }
      }
      // console.log('local artifact')
      // console.log(this.artifact_local)

      let response = null
      if (this.create) {
        // console.log('creating new artifact')
        response = await this.$artifactsEndpoint.create(this.artifact_local)
      } else {
        // console.log('curating')
        response = await this.$artifactEndpoint.update(
          this.artifact_local.id,
          this.artifact_local
        )
      }
      // console.log('response artifact')
      // console.log(response)

      this.artifact_local =
        typeof response !== 'undefined' ? response.artifact : {}

      this.disabled = false
      this.snackbar = true

      this.meta.keywords = this.getPossibleTags()
      this.meta.files = []
      this.meta.creators = []
      this.meta.badges = []
      this.meta.languages = []
      this.meta.relations = []

      if (this.create) {
        this.create = false
        this.$router.push(`/artifact/${this.artifact_local.id}?edit=true`)
      } else {
      }
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
    getLanguages() {
      let csv = this.artifact_local.meta.find(o => o.name == 'languages')
      if (csv) {
        return csv.value ? csv.value.split(',') : []
      } else {
        return []
      }
    },
    closeHandler(dialog) {
      switch (dialog) {
        case 'artifactdialog': {
          this.artifactdialog = false
        }
      }
    },
    affiliationObject() {
      return new Object({
        affiliation: {
          org: '',
          person: {
            email: '',
            name: ''
          }
        },
        roles: 'Author'
      })
    }
  }
}
</script>
