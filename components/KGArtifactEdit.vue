<template>
  <div v-if="artifact_local">
    <v-sheet border class="my-2">
      <v-card class="mx-auto" elevation="0">
        <v-card-title> {{ artifact_local.title }} </v-card-title>
        <v-card-text>
          <a target="_blank" :href="artifact_local.url" rel="noopener">
            {{ artifact_local.url }}
          </a>
        </v-card-text>
      </v-card>
    </v-sheet>
    <v-form v-model="valid" ref="artifact">
      <v-sheet border class="my-2">
        <v-card class="mx-auto" elevation="0">
          <v-card-title>Edit Artifact</v-card-title>
          <v-card-text>Want to edit relationship?
            <v-btn variant="text" size="small" color="primary"
              :to="`/artifact/${artifact_local.artifact_group_id}/${artifact_local.id}?edit_relation=true`">
              Click here
            </v-btn>
          </v-card-text>

          <div id="container-artifact-title" class="mb-4">
            <v-text-field id="input-artifact-title" variant="outlined" bg-color="grey-lighten-5" class="mx-8" label="Title"
                v-model="artifact_local.title" :rules="[rules.required, rules.exists, rules.notwhitespace]"
                required></v-text-field>
          </div>

          <div id="container-artifact-description" class="mb-4">
            <v-textarea id="input-artifact-description" auto-grow variant="outlined" bg-color="grey-lighten-5" class="mx-8" label="Description"
              v-model="artifact_local.description" :rules="[rules.required, rules.exists, rules.notwhitespace]" required></v-textarea>
          </div>

          <div id="container-artifact-url" class="mb-4">
            <v-text-field id="input-artifact-url" variant="outlined" bg-color="grey-lighten-5" class="mx-8" label="URL"
                v-model="artifact_local.url" :rules="[rules.required, rules.url, rules.notwhitespace]"
                required></v-text-field>
          </div>

          <div id="container-artifact-type" class="mb-4">
              <v-select id="select-artifact-type" :items="types" chips label="Select Artifact Type"
                variant="outlined" bg-color="grey-lighten-5" class="mx-8"
                v-model="artifact_local.type" :prepend-icon="iconImage(artifact_local.type)"
                :color="iconColor(artifact_local.type)" :rules="[rules.required, rules.exists]" required></v-select>
          </div>

          <v-divider class="py-4"></v-divider>

          <div id="container-artifact-authors">
            <v-card-title class="py-0">Authors</v-card-title>
            <v-card-text class="mx-4">
              <ArtifactChips v-model="artifact_local.affiliations" type="role" edit></ArtifactChips>
              <ArtifactChips v-model="meta.creators" type="role" ref="creatorsRef" edit></ArtifactChips>
              <v-dialog transition="dialog-bottom-transition" max-width="600px" persistent v-model="dialog">
                <template v-slot:activator="{ props }">
                  <v-btn class="text-success mt-n2 ml-n3" density="compact" variant="tonal" icon="mdi-plus"
                    v-bind="props"></v-btn>
                </template>
                <template v-slot:default>
                  <v-card>
                    <v-form v-model="dialogvalid" ref="dialogform">
                      <v-card-title>
                        <span class="text-h5">Add Author</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-combobox label="Organization Name" chips persistent-hint clearable v-if="orgs"
                                :items="orgNames" v-model="affiliation.affiliation.org"
                                hint="Select applicable organization from the list or type in your own"
                                v-model:search-input="search" item-value="org.name" item-title="org.name"
                                :rules="[rules.notwhitespace, rules.unique_creator]" return-object>
                                <template v-slot:no-data>
                                  <v-list-item>
                                    <v-list-item-title>
                                      No results matching "<strong>{{
                                        search
                                      }}</strong>". Press <kbd>enter</kbd> to create a new one
                                    </v-list-item-title>
                                  </v-list-item>
                                </template>
                              </v-combobox>
                            </v-col>
                            <v-col cols="12">
                              <v-text-field label="Author Name" v-model="affiliation.affiliation.person.name" :rules="[rules.required, rules.exists,
                              rules.notwhitespace, rules.unique_creator]" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-text-field label="Email Address" v-model="affiliation.affiliation.person.email"
                                :rules="[rules.notwhitespace, rules.unique_creator]"></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="() => {
                          meta.creators.push(affiliation)
                          dialog = false
                          affiliation = affiliationObject()
                          $refs.dialogform.reset()
                        }" :disabled="!dialogvalid" class="bg-success ml-2 mb-2" variant="text">Add</v-btn>
                        <v-btn class="bg-error ml-2 mb-2" variant="text" @click="() => {
                          dialog = false
                          affiliation = affiliationObject()
                          $refs.dialogform.reset()
                        }">
                          Close
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </template>
              </v-dialog>
            </v-card-text>
          </div>

          <v-divider class="py-4"></v-divider>

          <div id="container-artifact-venues" v-if="artifact_local.venues.length">
            <v-card-title class="py-0">Venues</v-card-title>
            <v-card-text class="mx-4">
              <ArtifactChips class="ml-4" v-model="artifact_local.venues" type="venue" edit></ArtifactChips>
            </v-card-text>
            <v-divider class="py-4"></v-divider>
          </div>

          <div id="container-artifact-keywords">
            <v-card-title class="py-0">Keywords</v-card-title>
            <v-card-text class="mx-4">
              <ArtifactChips v-model="artifact_local.tags" type="keyword" edit></ArtifactChips>
              <ArtifactChips v-model="meta.keywords" type="keyword" placeholder="Enter Keyword"
                :validator="validateKeyword" :formModel="valid" edit create></ArtifactChips>
            </v-card-text>
            <v-divider class="py-4"></v-divider>
          </div>

          <div id="container-artifact-programming-languages">
            <v-card-title class="py-0">Programming Languages</v-card-title>
            <v-card-text class="mx-4">
              <ArtifactChips v-model="meta.languages" type="software" placeholder="Enter Language" :formModel="valid" edit
                create></ArtifactChips>
            </v-card-text>
            <v-divider class="py-4"></v-divider>
          </div>

          <div id="container-artifact-badges">
            <v-card-title class="py-0">Badges</v-card-title>
            <v-card-text>
              <div>
                <span v-for="(b, index) in artifact_local.badges">
                  <v-img :key="`badgeimg${index}`" max-height="100" max-width="100" :src="b.badge.image_url"></v-img>
                  <a :href="b.badge.url" target="_blank" rel="noopener">
                    {{ b.badge.title }}
                  </a>
                  <v-icon @click="() => artifact_local.badges.splice(index, 1)" end>mdi-close</v-icon>
                </span>
              </div>
              <div>
                <v-chip v-for="(item, index) in meta.badges" :key="`newbadge${index}`" cols="12" class="ma-2" label>
                  <v-icon start>mdi-tag-outline</v-icon>

                  <v-select label="Badges" v-bind:items="badges" v-model="meta.badges[index]" item-title="id"
                    item-value="title" :rules="[rules.required]" return-object menu-icon="">
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props" :title="`${item.raw.organization} - ${item.raw.title}`"></v-list-item>
                    </template>
                    <template #selection="{ item }">
                      {{ item.raw.organization }} - {{ item.raw.title }}
                    </template>
                  </v-select>
                  <v-icon @click="() => meta.badges.splice(index, 1)" end>mdi-close</v-icon>
                </v-chip>
                <v-btn @click="() => meta.badges.push('')" class="text-success ml-2 mb-2" density="compact"
                  variant="tonal" icon="mdi-plus"></v-btn>
              </div>
            </v-card-text>
            <v-divider class="py-4"></v-divider>
          </div>

          <div v-if="artifact_local.type == 'software'">
            <div id="container-artifact-metrics" v-if="stars || watchers">
              <v-card-title class="py-0">Github Metrics</v-card-title>

              <v-card-text>
                <v-chip color="primary" cols="12" class="ma-2" label>
                  <v-avatar start>
                    <v-icon color="yellow">mdi-star</v-icon>
                  </v-avatar>

                  {{ stars }}
                </v-chip>
                <v-chip color="primary" cols="12" class="ma-2" label>
                  <v-avatar start>
                    <v-icon>mdi-eye</v-icon>
                  </v-avatar>

                  {{ watchers }}
                </v-chip>
              </v-card-text>
            </div>

            <div id="container-artifact-importer" v-if="record.artifact.importer">
              <v-card-title class="py-0">Importer</v-card-title>

              <v-card-text>
                <v-chip color="primary" cols="12" class="ma-2" label>
                  <v-avatar start>
                    <v-icon>mdi-file-download-outline</v-icon>
                  </v-avatar>
                  {{
                    `${record.artifact.importer.name} v${record.artifact.importer.version}`
                  }}
                </v-chip>
              </v-card-text>
            </div>
            <v-divider class="py-4"></v-divider>
          </div>


          <div id="container-artifact-licenses">
            <v-card-title class="py-0">License</v-card-title>
            <v-card-text>
              <v-chip class="ma-2" label>
                <v-icon start>mdi-scale-balance</v-icon>

                <v-autocomplete 
                  style="min-width: 150px;"
                  label="License" :items="possibleLicenses" v-model="artifact_local.license"
                  item-title="short_name" item-value="long_name" menu-icon="" return-object>
                  <template v-slot:item="{ item, props }">
                    <v-list-item v-bind="props" :title="`${item.raw.short_name} (${item.raw.long_name})`">
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item, props }">
                    <v-list-item v-bind="props">
                      {{ item.raw.short_name }} ({{ item.raw.long_name }})
                    </v-list-item>
                  </template>
                </v-autocomplete>

                <v-icon @click="() => artifact_local.license = null" end>mdi-close</v-icon>
              </v-chip>
            </v-card-text>
            <v-divider class="py-4"></v-divider>
          </div>

          <div id="container-artifact-files">
            <v-card-title class="py-0">Files</v-card-title>
            <v-card-text>
              <div v-if="artifact_local.files">
                <v-list v-model:opened="fileOpened" density="compact">
                <v-list-item 
                  v-for="(f, index) in artifact_local.files" 
                  :key="`file${index}`" 
                  :id="`file${index}`"
                  density="compact">
                  <v-list-group :value="f.name" density="compact">
                    <template v-slot:activator="{ props }">
                      <v-list-item v-bind="props" class="bg-grey-lighten-5 border">
                        <template v-slot:prepend>
                          <v-icon @click="() => artifact_local.files.splice(index, 1)">mdi-close</v-icon>
                        </template>
                        <a @click.stop target="_blank" :href="f.url" rel="noopener">{{
                          f.url
                        }}</a>
                        &nbsp; (type: {{ f.filetype ? f.filetype : 'unknown' }}, size:
                        {{ f.size ? convertSize(f.size) : 'unknown' }})
                      </v-list-item>
                    </template>
                    <v-list-item v-for="(fm, indexm) in f.members" :key="`mem${indexm}`" density="compact" class="bg-grey-lighten-4 border-b border-s border-e">
                      <a target="_blank" :href="fm.html_url || fm.download_url" rel="noopener">{{
                        fm.pathname || fm.name || fm.html_url || fm.download_url
                      }}</a>
                      &nbsp; (type: {{ fm.filetype ? fm.filetype : 'unknown' }}, size:
                      {{ fm.size ? convertSize(fm.size) : 'unknown' }})
                    </v-list-item>
                  </v-list-group>
                </v-list-item>
              </v-list>

                <div>
                  <v-card-text v-for="(f, index) in meta.files" :key="`newfile${index}`" cols="12">
                    <v-textarea variant="outlined" row="10" label="File URL" placeholder="Enter File URL" v-model="f.url"
                      prepend-icon="mdi-file" append-icon="mdi-close" @click:append="() => meta.files.splice(index, 1)"
                      :rules="[rules.required, rules.url]" required></v-textarea>
                  </v-card-text>
                  <v-btn @click="() => meta.files.push({ url: '', filetype: 'unknown' })" class="text-success ml-2 mb-2"
                    variant="tonal" density="compact" icon="mdi-plus"></v-btn>
                </div>
              </div>
              <div class="ml-4 mb-2" v-else>No files found by importer</div>
            </v-card-text>
          </div>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="canReplayCurations" color="success" @click="replayCurations">
              Reapply Prior Version Edits
            </v-btn>
            <v-divider v-if="!record.artifact.curations && record.artifact.importer" vertical>
            </v-divider>
            &nbsp;
            <v-btn color="success" :disabled="!valid || disabled" @click="save()" id="btn-save-artifact">
              Save
            </v-btn>
            &nbsp;
            &nbsp;
            <v-divider vertical>
            </v-divider>
            <v-dialog v-model="publish_dialog" width="500">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" color="primary" :disabled="!valid || disabled" id="btn-publish-artifact">
                  Publish
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="text-h5 text-black-lighten-2">
                  Publish this version
                </v-card-title>
                <v-card-text>
                  Describe the changes you made in this version in the field below.
                </v-card-text>
                <v-card-text>
                  <v-textarea variant="outlined" auto-grow rows="1" label="Publication notes"
                    v-model="publish_notes"></v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" :disabled="!valid || disabled" @click="publish()">
                    Publish
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            &nbsp;
            &nbsp;
            <v-divider vertical>
            </v-divider>
            &nbsp;
            &nbsp;
            <v-btn v-if="!record.artifact.publication" color="error" @click="deleteDraft()">
              Delete Draft
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-form>

    <v-snackbar v-model="snackbar" timeout:3000>
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn @click="snackbar = false" icon="mdi-close"></v-btn>
      </template>
    </v-snackbar>

    <template>
      <v-dialog v-model="replay_results_dialog" scrollable>
        <v-card>
          <v-card-title>
            <span class="text-h5">Curation Reapply Results</span>
          </v-card-title>
          <v-card-text>
            <ArtifactCurationList :curations="replay_results"></ArtifactCurationList>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="replay_results_dialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </div>
  <!-- The loading is needed because otherwise the var dereferences above would cause a failure to load if the data is not available yet -->
  <div v-else>
    {{ loadingMessage }}
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState } from 'pinia'
import { artifactIcon, artifactColor, bytesToSize } from '@/helpers'
import schemaWithPointers from '~/schema/artifact.json'
import affiliationSchemaWithPointers from '~/schema/affiliation.json'
import { zipArray } from '@/helpers'
import { userStore } from '~/stores/user'

function affiliationObjectsEqual(o1, o2) {
  //console.log("o1: ",o1)
  //console.log("o2: ",o2)
  let ea = ["", null]
  if (((ea.includes(o1.affiliation.org) && ea.includes(o2.affiliation.org))
    || o1.affiliation.org == o2.affiliation.org)
    && ((ea.includes(o1.affiliation.person.name) && ea.includes(o2.affiliation.person.name))
      || o1.affiliation.person.name == o2.affiliation.person.name)
    && ((ea.includes(o1.affiliation.person.email) && ea.includes(o2.affiliation.person.email))
      || o1.affiliation.person.email == o2.affiliation.person.email)) {
    console.log("o1 == o2")
    return true
  }
  else {
    //console.log("o1 != o2")
    return false
  }
}

function tagObjectsEqual(o1, o2) {
  //console.log("o1: ",o1)
  //console.log("o2: ",o2)
  let ea = ["", null]
  if (((ea.includes(o1.source) && ea.includes(o2.source))
    || o1.source == o2.source)
    && o1.tag == o2.tag) {
    console.log("o1 == o2")
    return true
  }
  else {
    //console.log("o1 != o2")
    return false
  }
}

export default defineComponent({
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
    ArtifactChips: defineAsyncComponent(() => import("@/components/ArtifactChips")),
    ArtifactCurationList: defineAsyncComponent(() => import("@/components/ArtifactCurationList")),
  },
  data() {
    return {
      loading: true,
      publish_local: false,
      publish_dialog: false,
      publish_notes: "",
      snackbar: false,
      replay_results_dialog: false,
      replay_results: [],
      loadingMessage: 'Loading...',
      artifact_local: {},
      meta: {
        creators: [],
        keywords: [],
        files: [],
        languages: [],
        relations: [],
        badges: [],
        venues: []
      },
      affiliation: this.affiliationObject(),
      schema: {},
      affiliationSchema: {},
      schemaLoaded: false,
      valid: true,
      dialog: false,
      dialogvalid: true,
      disabled: false,
      fileOpened: [],
      artifactdialog: false,
      search: '',
      snackbarMessage: '',
      possibleLicenses: [],
      rules: {
        required: value => !!value || 'required',
        exists: value => {
          return typeof value === 'string' ? value.length > 0 : false
        },
        notwhitespace: value => {
          return !value ? true : (value.trim().length > 0 || 'empty string invalid')
        },
        url: value => {
          let pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g //https://regexr.com/3e6m0
          return pattern.test(value) || 'Invalid URL'
        },
        unique_creator: X => {
          let newaffiliation = this.affiliation
          if ("affiliations" in this.artifact_local
            && this.artifact_local.affiliations !== undefined) {
            //console.log("local.affiliations: ",this.artifact_local.affiliations)
            for (let i = 0; i < this.artifact_local.affiliations.length; ++i) {
              let item = this.artifact_local.affiliations[i]
              if (affiliationObjectsEqual(newaffiliation, item))
                return 'duplicate author'
            }
          }
          //console.log("creators: ",this.meta.creators)
          for (let i = 0; i < this.meta.creators.length; ++i) {
            let item = this.meta.creators[i]
            if (affiliationObjectsEqual(newaffiliation, item))
              return 'duplicate author'
          }
          return true
        }
      }
    }
  },
  async created() {
    this.$resolver.resolve(schemaWithPointers).then(schema => {
      this.schema = schema.result
      this.schemaLoaded = true
    }).catch(err => {
      // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
      // including referenced files, combined into a single object
      console.error(err)
    })
    this.$resolver.resolve(affiliationSchemaWithPointers).then(schema => {
      this.affiliationSchema = schema.result
      this.schemaLoaded = true
    }).catch(err => {
      // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
      // including referenced files, combined into a single object
      console.error(err)
    });

    this.artifact_local = JSON.parse(JSON.stringify(this.record.artifact))
    this.meta.languages = this.getLanguages()
    this.meta.keywords = this.getPossibleTags()
    let response = await this.$licenseEndpoint.index({ verified: 1, all: 1 })
    this.possibleLicenses =
      typeof response !== 'undefined' ? response.licenses : []
  },
  mounted() {
    // force title and description to refresh on page load
    if (this.title && this.description) return true
    setTimeout(() => {
      this.loadingMessage = 'Error loading'
    }, 5000)
    this.$on('close', this.closeHandler)
    this.$userStore.fetchOrgs()
    this.$userStore.fetchBadges()
    this.$userStore.fetchVenues()
  },
  computed: {
    ...mapState(userStore, ['orgs', 'badges', 'venues']),
    orgNames: {
      get: function () {
        return this.orgs.map(m => m.name)
      }
    },
    sanitizedDescription: function () {
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
    },
    canReplayCurations: function () {
      return (this.record.artifact.importer
        && this.record.artifact.parent_id != null
        && (this.record.artifact.curations === 'undefined'
          || this.record.artifact.curations.length < 1))
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

      // save the artifact first
      await this.save()

      let response = await this.tryOrError(async () => {
        return await this.$artifactEndpoint.update(
          [this.artifact_local.artifact_group_id, this.artifact_local.id],
          {
            publication: { notes: this.publish_notes }
          }
        )
      })
      this.$artifactsStore.fetchArtifact({
        artifact_group_id: this.artifact_local.artifact_group_id,
        id: this.artifact_local.id
      })

      navigateTo(`/artifact/${this.artifact_local.artifact_group_id}`)
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
          if (affil.affiliation.org === "") {
            affil.affiliation.org = null
            return
          }
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

      // venues
      this.artifact_local.venues =
        typeof this.artifact_local.venues !== 'undefined' &&
          this.artifact_local.venues !== null
          ? this.artifact_local.venues.concat(
            zipArray('venue', this.meta.venues)
          )
          : zipArray('venue', this.meta.venues)

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

      let artifact = this.artifact_local
      let response = await this.tryOrError(async () => {
        let response
        if (this.create) {
          // console.log('creating new artifact')
          response = await this.$artifactsEndpoint.create(this.artifact_local)
        } else {
          // console.log('curating')
          response = await this.$artifactEndpoint.update(
            [artifact.artifact_group_id, artifact.id],
            artifact)
        }
        return response
      })
      // console.log('response artifact')
      // console.log(response)

      this.artifact_local =
        typeof response !== 'undefined' ? response.artifact : artifact

      this.disabled = false
      this.openSnackbar('Artifact Saved')

      this.meta.keywords = this.getPossibleTags()
      this.meta.files = []
      this.meta.creators = []
      this.meta.badges = []
      this.meta.venues = []
      this.meta.languages = []
      this.meta.relations = []

      if (this.create) {
        this.create = false
        navigateTo(`/artifact/${this.artifact_local.artifact_group_id}/${this.artifact_local.id}?edit=true`)
      }
    },
    async replayCurations() {
      // console.log('curating')
      let response = await this.tryOrError(async () => {
        return await this.$artifactEndpoint.update(
          [this.artifact_local.artifact_group_id, this.artifact_local.id],
          { replay_curations: true }
        )
      })
      this.replay_results = response.replay_results
      for (var i = 0; i < this.replay_results.length; ++i) {
        this.replay_results[i]._id = i
        this.replay_results[i].curation.opdata =
          JSON.parse(this.replay_results[i].curation.opdata)
      }
      this.replay_results_dialog = true
      this.$artifactsStore.fetchArtifact({
        artifact_group_id: this.artifact_local.artifact_group_id,
        id: this.artifact_local.id
      })
    },
    async deleteDraft() {
      // console.log('deleting draft')
      let response = await this.tryOrError(async () => {
        return await this.$artifactEndpoint.delete(
        [this.artifact_local.artifact_group_id, this.artifact_local.id])
      })
      this.$router.back()
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
      // console.log(this.artifact_local)
      if (typeof this.artifact_local.tags === 'undefined'
        || this.artifact_local.tags.length > 0) return []
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
    },
    validateKeyword(value) {
      let newTagObj = new Object({
        tag: value,
        source: null
      })
      for (let i = 0; i < this.artifact_local.tags.length; ++i) {
        let item = this.artifact_local.tags[i]
        if (tagObjectsEqual(newTagObj, item)) {
          console.log("validateKeyword: duplicate of existing: ", value, item)
          return 'duplicate tag'
        }
      }
      if (typeof this.meta.keywords !== "undefined") {
        for (let i = 0; i < this.meta.keywords.length - 1; ++i) {
          if (value == this.meta.keywords[i]) {
            console.log("validateKeyword: duplicate of new: ", value, this.meta.keywords[i])
            return 'duplicate author'
          }
        }
      }
      console.log("validateKeyword: unique: ", value)
      return true
    },
    async tryOrError(callback) {
      try {
        return await callback()
      } catch (error) {
        this.openSnackbar(error.data.message)
        return
      }
    },
    openSnackbar(message) {
      this.snackbar = true
      this.snackbarMessage = message
    }
  }
});
</script>
