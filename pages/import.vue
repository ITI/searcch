<template>
  <span>
    <v-layout column justify-center align-center>
      <v-flex xs12 sm8 md6>
        <div class="text-center">
          <logo />
        </div>
      </v-flex>
    </v-layout>
    <v-layout column justify-left align-top>
      <v-row class="ml-1 mb-2"
        ><h1>Artifact Import</h1>
        <v-dialog transition="dialog-bottom-transition" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="primary ml-4" fab small v-bind="attrs" v-on="on"
              ><v-icon>mdi-help</v-icon></v-btn
            >
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark>Import Help</v-toolbar>
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
                <v-btn text @click="dialog.value = false">Close</v-btn>
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
      <v-form v-model="valid">
        <v-row>
          <v-col cols="10">
            <v-text-field
              label="URL"
              v-model="url"
              placeholder="http://github.com/iti/project"
              outlined
              :rules="[rules.required, rules.url]"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn
              class="primary mt-2"
              :disabled="importing"
              @click="startImport()"
              block
              >Start Import</v-btn
            >
          </v-col>
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
      <div v-else>{{ loadingMessage }}</div>
    </v-layout>
  </span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
    Logo: () => import('@/components/Logo'),
    ImportList: () => import('@/components/ImportList')
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
      rules: {
        required: value => !!value || 'URL required',
        url: value => {
          let pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g //https://regexr.com/3e6m0
          return pattern.test(value) || 'Invalid URL'
        }
      }
    }
  },
  async mounted() {
    this.loadingMessage = 'Loading imports...'
    this.updateImports()
    this.timeoutID = setTimeout(() => {
      this.loadingMessage = 'No imports found'
      clearInterval(this.pollingID)
    }, 5000)
    this.pollingID = setInterval(
      function() {
        this.updateImports()
      }.bind(this),
      3000
    )
  },
  computed: {
    ...mapState({
      imports: state => state.artifacts.imports
    })
  },
  methods: {
    async startImport() {
      if (!this.valid) return
      this.importing = true
      let response = await this.$importsEndpoint.create({
        url: this.url
      })
      this.updateImports()
      clearInterval(this.pollingID)
      this.pollingID = setInterval(
        function() {
          this.updateImports()
        }.bind(this),
        3000
      )
      this.url = undefined
      this.importing = false
    },
    updateImports() {
      this.$store.dispatch('artifacts/fetchImports', {})
      if (
        !this.imports.some(m => m.status.match(/^(running|pending|scheduled)$/))
      ) {
        clearInterval(this.pollingID)
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.pollingID)
    clearTimeout(this.timeoutID)
    next()
  }
}
</script>
