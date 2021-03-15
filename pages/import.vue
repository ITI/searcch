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
    <v-row class="ml-1 mb-2"><h1>Import</h1>
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="primary ml-4"
            fab
            small
            v-bind="attrs"
            v-on="on"
          ><v-icon>mdi-help</v-icon></v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar
              color="primary"
              dark
            >Import Help</v-toolbar>
            <v-card-text>
              <div class="text-h6 pa-12">
                <p>To start importing, place the URL of an artifact in the input field and click Start Import<p>
                <p>Once an import has started, it will show up in your imports list, below the URL field</p>
                <p>The importer will have to process through a few stages to get all of the information scraped and formatted properly. 
                  Once the progress bar shows the process is complete, you will have the option to view the imported artifact by clicking Read More</p>
                <p>We have provided an edit button to show what an editor will look like for artifacts, but that feature is not currently available in the beta version</p>
                <p>Once you are ready to add your artifact to the list of searchable artifacts, you can click Publish. Press Archive to hide a completed import from your list</p>
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="dialog.value = false"
              >Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-row>
    <v-divider></v-divider><br>
    <v-form v-model="valid">
      <v-row>
        <v-col cols="10">
          <v-text-field
              label="URL"
              v-model="url"
              placeholder="http://github.com/MyProject"
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
          >Start Import</v-btn>
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col cols="10">
          <v-expansion-panels model="advanced.open">
            <v-expansion-panel  class="rounded-0">
              <v-expansion-panel-header>
                <template v-slot:default="{ open }">
                  <v-row no-gutters>
                    <v-col cols="4">
                      Advanced
                    </v-col>
                    <v-col
                      cols="8"
                      class="text--secondary"
                    >
                      <v-fade-transition leave-absolute>
                        <span
                          v-if="open"
                          key="0"
                        >
                          Select advanced filters for your query
                        </span>
                        <span
                          v-else
                          key="1"
                        >
                          {{ advanced.query }}
                        </span>
                      </v-fade-transition>
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row align="center">
                  <v-col cols="3">
                    <v-select
                      v-model="advanced.type"
                      :items="types"
                      label="Artifact type"
                      class="rounded-0"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="3">
                    <v-select
                      v-model="advanced.importer"
                      :items="importers"
                      label="Importer version"
                      class="rounded-0"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row> -->
    </v-form>
    <br><v-divider></v-divider><br>
    <ImportList v-if="imports.length" :imports="imports"></ImportList>
    <div v-else>{{ loadingMessage }}</div>
  </v-layout>
</span>
</template>

<script>
import ImportList from '~/components/ImportList'
import Logo from '~/components/Logo.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Logo,
    ImportList
  },
  data() {
    return {
      importing: false,
      importMessage: "Loading imports...",
      polling: null,
      dialog: false,
      valid: false,
      url: null,
      rules: {
        required: value => !!value || 'URL required',
        url: value => {
          let pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g //https://regexr.com/3e6m0
          return pattern.test(value) || 'Invalid URL'
        },
      },
      advanced: {
        open: false,
        type: null,
      },
      types: [
        { text: 'Dataset', value: "dataset" },
        { text: 'Publication', value: "publication" },
        { text: 'Code', value: "code" },
        { text: 'Executable', value: "executable" },
        { text: 'Methodology', value: "methodology" },
        { text: 'Metrics', value: "metrics" },
        { text: 'Hypothesis', value: "hypothesis" },
        { text: 'Domain', value: "domain" },
        { text: 'Supporting Info', value: "supportinginfo" },
        { text: 'Prior Work', value: "priorwork" },
      ],
      importers: []
    }
  },
  async mounted () {
    this.loadingMessage = "Loading imports..."
    this.updateImports()
    setTimeout(() => { 
      this.loadingMessage = "No imports found"
    }, 3000);
    this.polling = setInterval(function () {
      this.updateImports()
    }.bind(this), 5000)
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      imports: state => state.artifacts.imports,
    }),
  },
  methods: {
    async startImport () {
      if (!this.valid) return
      this.importing = true
      let response = await this.$importsEndpoint.create({
        userid: this.user_id,
        url: this.url,
      })
      this.updateImports()
      this.importing = false
    },
    updateImports () {
      if (this.user_id) this.$store.dispatch('artifacts/fetchImports', { userid: this.user_id })
    },
  },
  watch: {
    user_id () {
      // had to make this because on refresh, user_id doesn't update until after the mounted has already run, 
      // but mounted needs to run when switching pages where the user_id doesn't update
      this.updateImports()
    }
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.polling)
    next()
  }
}
</script>