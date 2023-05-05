<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col sm="12" md="10" lg="6">
        <div class="text-center">
          <logo />
        </div>
      </v-col>
    </v-row>
    <v-row justify="start" align="start">
      <v-row class="ml-1 mb-2">
        <h1>Artifact Import</h1>
        <v-dialog transition="dialog-bottom-transition" max-width="600">
          <template v-slot:activator="{ props }">
            <v-btn class="bg-primary ml-4 rounded-circle" size="small" v-bind="props"
              ><v-icon>mdi-help</v-icon></v-btn
            >
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" theme="dark">Import Help</v-toolbar>
              <v-card-text>
                <div class="text-h6 pa-12">
                  <p>
                    Artifacts published on GitHub, ACM digital library, IEEE
                    Xplore, USENIX web site publication, arXiv, Papers With
                    Code, Zenodo, and generic git repositories can be processed
                    using our import assistant. All other artifact sources must
                    be manually processed.
                  </p>
                  <p>
                    To start the import assistant, type the URL of an artifact
                    in the input field and click START IMPORT.
                  </p>
                  <p>
                    When the import processing starts, it will show up in your
                    imports list below the URL field.
                  </p>
                  <p>
                    The import assistant works in multiple stages to scrape all
                    of the information and format it properly. Once the progress
                    bar shows the process is complete, you should review and
                    correct the information (as needed) by clicking EDIT.
                  </p>
                  <p>
                    When you are ready to make your artifact available in the
                    catalog of searchable artifacts, click PUBLISH.
                  </p>
                  <p>
                    Click ARCHIVE to hide a completed import from your list.
                  </p>
                </div>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn variant="text" @click="dialog.value = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-row>
      <v-divider></v-divider><br />
      <h2>Artifact Import Assistant</h2>
      <p>
        Supported artifact locations are: GitHub, ACM digital library, IEEE
        Xplore, USENIX web site publication, arXiv, Papers With Code, Zenodo,
        and openly-accessible generic git repositories.
      </p>
      <p>
        Enter the supported URL for your artifact:
      </p>
      <v-form v-model="valid" ref="importform">
        <v-row dense>
          <v-col cols="10" class="ma-1 pa-1">
            <v-text-field
              label="URL"
              v-model="url"
              placeholder="http://github.com/iti/project"
              variant="outlined"
              hide-details="auto"
              :rules="[rules.required, rules.url]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center" dense>
          <v-col cols="2" class="ma-1 pa-1">
            <v-btn
              class="bg-primary"
              :disabled="importing"
              @click="startImport()"
              block
              >Start Import</v-btn
            >
          </v-col>
          <v-divider class="mx-4" vertical></v-divider>
          <v-col class="ma-1 pa-1">
            <v-tooltip
              color="grey-darken-4"
              max-width="400px"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  <v-checkbox
                    class="ma-1 pa-1"
                    label="Import candidates"
                    v-model="autofollow"
                    hide-details="auto"
                    density="compact"
                    ></v-checkbox>
                  </span>
              </template>
              <span>
                If the initial import of the URL you enter suggests
                additional, related <strong>candidate</strong> artifacts to
                import, selecting this option will automatically import
                those as artifacts, <strong>and</strong> create the
                recommended relationships between them.
              </span>
            </v-tooltip>
          </v-col>
          <v-col class="ma-1 pa-1">
            <v-tooltip
              color="grey-darken-4"
              max-width="400px"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  <v-checkbox
                    class="ma-1 pa-1"
                    label="Disable Extraction"
                    v-model="noextract"
                    hide-details="auto"
                    density="compact"
                  ></v-checkbox>
                </span>
              </template>
              <span>
                If selected, disables potentially costly metadata extraction
                (e.g. keyword extraction) from fetched artifact content.
              </span>
            </v-tooltip>
          </v-col>
          <v-col class="ma-1 pa-1">
            <v-tooltip
              color="grey-darken-4"
              max-width="400px"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  <v-checkbox
                    class="ma-1 pa-1"
                    label="Disable Fetch"
                    v-model="nofetch"
                    hide-details="auto"
                    density="compact"
                  ></v-checkbox>
                </span>
              </template>
              <span>
                If selected, disables retrieval of the artifact's content --
                for instance, source code repositories and associated files
                (e.g papers, presentations, etc).  If your artifact is a
                fork of the Linux kernel, you might consider selecting this
                box.
              </span>
            </v-tooltip>
          </v-col>
          <v-col class="ma-1 pa-1">
            <v-tooltip
              color="grey-darken-4"
              max-width="400px"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  <v-checkbox
                    v-if="user_is_admin"
                    class="ma-1 pa-1"
                    label="Disable Removal"
                    v-model="noremove"
                    hide-details="auto"
                    density="compact"
                  ></v-checkbox>
                </span>
              </template>
              <span>
                If selected, disables removal of fetched content at the
                importer service that performed the import.  This should
                only be selected by administrators to facilitate debugging.
              </span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
        </v-row>
      </v-form>
      <br />
      <v-row class="ml-1 mb-2">
        Artifacts stored on unsupported sources may be manually imported. &nbsp;
        <NuxtLink to="/create">Click here</NuxtLink> &nbsp; to start a manual
        import.
      </v-row>
      <br /><v-divider></v-divider><br />
      <h2>Imported Artifacts</h2>
      <ImportList v-if="imports.length" :imports="imports"></ImportList>
      <v-pagination
        v-if="imports.length"
        v-model="page"
        :length="pages"
        rounded
      ></v-pagination>
      <div v-else>{{ loadingMessage }}</div>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState } from 'pinia'
import { userStore } from '~/stores/user'
import { artifactsStore } from '~/stores/artifacts'

export default defineComponent({
  components: {
    Logo: defineAsyncComponent(() => import('@/components/Logo')),
    ImportList: defineAsyncComponent(() => import('@/components/ImportList'))
  },
  head() {
    return {
      title: 'SEARCCH Artifact Import',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Hub Artifact Import'
        }
      ]
    }
  },

  data() {
    return {
      importing: false,
      loadingMessage: 'Loading imports...',
      pollingID: null,
      timeoutID: null,
      dialog: false,
      valid: false,
      url: null,
      nofetch: null,
      noextract: null,
      noremove: null,
      autofollow: true,
      rules: {
        required: value => !!value || 'URL required',
        url: value => {
          let pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g //https://regexr.com/3e6m0
          return pattern.test(value) || 'Invalid URL'
        }
      },
      page: 1
    }
  },
  async mounted() {
    this.loadingMessage = 'Loading imports...'
    this.updateImports()
    this.timeoutID = setTimeout(() => {
      this.loadingMessage = 'No imports found'
      clearInterval(this.pollingID)
      this.pollingID = null
    }, 5000)
    this.pollingID = setInterval(
      function() {
        this.updateImports()
      }.bind(this),
      3000
    )
  },
  computed: {
    ...mapState(artifactsStore, {
      imports: state => state.imports.artifact_imports,
      pages: state => state.imports.pages,
      total: state => state.imports.total
    }),
    ...mapState(userStore, {
      user_is_admin: state => state.user_is_admin
    })
  },
  methods: {
    async startImport() {
      if (!this.valid) return
      this.importing = true
      let response = await this.$importsEndpoint.create({
        url: this.url,
        nofetch: this.nofetch,
        noextract: this.noextract,
        noremove: this.noremove,
        autofollow: this.autofollow
      })
      this.$refs.importform.reset()
      this.updateImports()
      clearInterval(this.pollingID)
      this.pollingID = setInterval(
        function() {
          this.updateImports()
        }.bind(this),
        3000
      )
      this.url = undefined
      this.nofetch = false
      this.noextract = false
      this.noremove = false
      this.autofollow = true
      this.importing = false
    },
    updateImports() {
      this.$artifactsStore.fetchImports({ "page": this.page })
      if (
        !this.imports.some(m => m.status.match(/^(running|pending|scheduled)$/))
      ) {
        clearInterval(this.pollingID)
        this.pollingID = null
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.pollingID)
    this.pollingID = null
    clearTimeout(this.timeoutID)
    next()
  },
  watch: {
    page() {
      this.updateImports()
    },
    imports() {
      if (this.pollingID === null) {
        this.pollingID = setInterval(
          function() {
            this.updateImports()
          }.bind(this),
          3000
        )
      }
    }
  }
});
</script>
