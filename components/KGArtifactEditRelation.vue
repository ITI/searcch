<template>
  <div v-if="artifact_local">
    <div>
      <v-card class="mx-auto my-2" outlined>
        <v-card-title> {{ artifact_local.title }} </v-card-title>
        <v-card-text>
          <a target="_blank" :href="artifact_local.url" rel="noopener">
            {{ artifact_local.url }}
          </a>
        </v-card-text>
      </v-card>
    </div>
    <v-card class="mx-auto my-2" outlined>
      
      <v-card-title>Edit Relationship</v-card-title>
      <v-card-text>Want to edit content? <v-btn text small color="primary" :to="`/artifact/${artifact_local.artifact_group_id}/${artifact_local.id}?edit=true`">Click here</v-btn></v-card-text>

      <ArtifactRelationView :artifact_group="artifact_local.artifact_group" edit></ArtifactRelationView>

      <div>
        <v-dialog
          transition="dialog-bottom-transition"
          persistent
          fullscreen
          v-model="artifactdialog"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-card-actions class="mt-n4">
              <v-row>
                <v-col cols="12" md="2"></v-col>
                <v-col cols="12" md="10">
                  <v-btn
                    color="primary"
                    block depressed outlined
                    v-bind="attrs"
                    v-on="on"
                    :disabled="artifact_local.id ? false : true"
                  >
                    Add New Relation
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
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
    </v-card>

  </div>
  <!-- The loading is needed because otherwise the var dereferences above would cause a failure to load if the data is not available yet -->
  <div v-else>
    {{ loadingMessage }}
  </div>
</template>

<script>
import $RefParser from 'json-schema-ref-parser'
import schemaWithPointers from '~/schema/artifact.json'
import affiliationSchemaWithPointers from '~/schema/affiliation.json'
import { EventBus } from '@/helpers'
import ArtifactRelationView from './ArtifactRelationView.vue'

export default {
  name: 'KGArtifactEditRelation',
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
    SearchCard: () => import("@/components/SearchCard"),
    ArtifactRelationView: () => import("@/components/ArtifactRelationView"),
},
  data() {
    return {
      loading: true,
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
      artifactdialog: false,
      search: '',
      possibleLicenses: [],
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
    EventBus.$on('close', this.closeHandler)
    this.$store.dispatch('user/fetchOrgs')
    this.$store.dispatch('user/fetchBadges')
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
  }
}
</script>
