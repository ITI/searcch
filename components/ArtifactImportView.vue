<template>
  <div>
    <v-card tile class="mx-auto pa-1 overflow-hidden" elevation="3">
      <v-row class="px-0">
        <v-col cols="10" class="pa-1">
          <v-card-title class="align-start">
            <div>
              <span class="headline"
                >Import:&nbsp;<a
                  target="_blank"
                  :href="artifact.url"
                  rel="noopener"
                  >{{ artifactTitle }}</a
                ></span
              >
            </div>
          </v-card-title>
        </v-col>
        <v-col cols="2" class="text-lg-right">
          <ArtifactChips
            :field="[artifactType]"
            :type="artifactType"
          ></ArtifactChips>
        </v-col>
      </v-row>

      <v-card-text class="pa-2">
        <v-progress-linear
          color="light-blue"
          height="25"
          :value="artifact.progress"
          ><strong>{{ artifact.progress }}%</strong></v-progress-linear
        >
        {{ artifact.status }} - {{ artifact.phase }}
      </v-card-text>
      <v-row v-if="artifact.status === 'failed'" class="px-2">
        <v-col cols="10">
          <v-card-text>
            message:
            {{ artifact.message }}
          </v-card-text>
          <span v-if="this.artifact.log">
            log:
            <v-textarea
              auto-grow
              readonly
              :value="this.artifact.log"
            ></v-textarea>
          </span>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn
          v-if="artifact.artifact_id"
          color="error"
          @click="deleteArtifact()"
        >
          Delete
        </v-btn>

        <v-btn
          v-if="artifact.artifact_id || archived"
          color="orange"
          @click="archive()"
        >
          Archive
        </v-btn>

        <v-btn v-else color="error" @click="deleteImport()">
          Delete Import
        </v-btn>

        <v-btn
          v-if="artifact.artifact_id"
          :to="{
            path: `/artifact/${artifact.artifact_group_id}/${artifact.artifact_id}`,
            query: { edit: 'true' }
          }"
          color="success"
        >
          Edit
        </v-btn>

        <v-btn v-if="archived === true" @click="unarchive()">
          Unarchive
        </v-btn>

        <v-spacer></v-spacer>

        <!-- <v-btn
          :disabled="!artifact.artifact_id"
          @click="publish()"
          color="success"
        >
          Publish
        </v-btn> -->

        <v-btn
          :to="`/artifact/${artifact.artifact_group_id}/${artifact.artifact_id}`"
          :disabled="!artifact.artifact_id"
          color="primary"
        >
          Read More
        </v-btn>
      </v-card-actions>
      <v-row
        v-if="artifact.artifact !== 'undefined' &&
              artifact.artifact !== null &&
              artifact.artifact.candidate_relationships !== 'undefined' &&
              artifact.artifact.candidate_relationships !== null &&
              artifact.artifact.candidate_relationships.length"
      >
        <div
          v-for="cr in artifact.artifact.candidate_relationships"
          :key="cr.id">
        <v-col cols="12">
          <v-divider class="ma-2 pa-0"></v-divider>
          <div>
            <v-row class="ma-2 pa-0">
              <span>
                <b>Related Candidate (<i>{{ cr.relation }}</i>)</b>:&nbsp;
                <a
                  target="_blank"
                  :href="cr.related_candidate.url"
                  rel="noopener"
                >{{ cr.related_candidate.url }}</a>
              </span>
            </v-row>
            <v-row
              class="ma-2 mx-6 pa-0"
              v-if="cr.related_candidate.artifact_import !== 'undefined'
                    && cr.related_candidate.artifact_import !== null"
            >
              <v-col cols="auto" class="pa-0">
                  Import status: {{ cr.related_candidate.artifact_import.status }} -
                  {{ cr.related_candidate.artifact_import.phase }}&nbsp;&nbsp;
              </v-col>
              <v-col cols="3" class="pa-0">
                <v-progress-linear
                  color="light-blue lighten-3"
                  height="25"
                  :value="artifact.progress"
                >
                  <strong>{{ cr.related_candidate.artifact_import.progress }}%</strong>
                </v-progress-linear>
              </v-col>
            </v-row>
            <v-row
              class="ma-2 mx-6 pa-0"
              v-else
            >
              <v-col cols="auto" class="pa-0">
                <v-btn
                  color="primary"
                  small
                  @click="importCandidate(cr)"
                >
                  Start Import
                </v-btn>
              </v-col>
              <v-col cols="auto" class="pa-0 pl-2">
                <v-btn
                  color="error"
                  small
                  @click="deleteCandidate(cr)"
                >
                  Delete Candidate
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-col>
        </div>
      </v-row>
    </v-card>
  </div>
</template>

<script>

export default {
  props: {
    artifact: {
      type: Object,
      required: true
    }
  },
  components: {
    ArtifactChips: () => import('@/components/ArtifactChips')
  },
  data() {
    return {}
  },
  computed: {
    artifactType() {
      if (this.artifact.artifact !== "undefined" && this.artifact.artifact) return this.artifact.artifact.type
      if (this.artifact.type == null) return 'Detecting Type...'
      return this.artifact.type
    },
    artifactTitle() {
      return this.artifact.url
    },
    archived() {
      return this.artifact.archived ? this.artifact.archived : false
    }
  },
  methods: {
    async deleteArtifact() {
      let response = await this.$artifactEndpoint.delete(
        [this.artifact.artifact_group_id, this.artifact.artifact_id]
      )
      this.updateImports()
    },
    async deleteImport() {
      // artifact.id here is the import ID
      let response = await this.$importEndpoint.delete(this.artifact.id)
      this.updateImports()
    },
    async archive() {
      let response = await this.$importEndpoint.update(this.artifact.id, {
        archived: true
      })
      this.updateImports()
    },
    async unarchive() {
      let response = await this.$importEndpoint.update(this.artifact.id, {
        archived: false
      })
      this.updateImports()
    },
    async publish() {
      if (!confirm('Are you sure you want to publish this artifact?')) return

      let response = await this.$artifactEndpoint.update(
        [this.artifact.artifact_group_id, this.artifact.id],
        {
          publication: {}
        }
      )
      this.publish_local = true
      this.updateImports()
    },
    async importCandidate(cr) {
      console.log("importCandidate: ", cr)
      let response = await this.$importsEndpoint.create({
        candidate_artifact_id: cr.related_candidate_id
      })
      this.updateImports()
    },
    async deleteCandidate(cr) {
      let response = await this.$candidateArtifactEndpoint.delete(cr.related_candidate_id)
      this.updateImports()
    },
    updateImports() {
      this.$store.dispatch('artifacts/fetchImports', {})
    }
  }
}
</script>

<style scoped>
.v-card__title {
  word-break: normal;
}
</style>
