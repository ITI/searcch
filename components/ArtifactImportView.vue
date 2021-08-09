<template>
  <div>
    <v-card tile class="mx-auto overflow-hidden" elevation="3">
      <v-row class="px-3">
        <v-col cols="10">
          <v-card-title class="align-start">
            <div>
              <span class="headline"
                >Import ID {{ artifact.id }}:&nbsp;<a
                  target="_blank"
                  :href="artifact.url"
                  >{{ artifactTitle }}</a
                ></span
              >
            </div>
          </v-card-title>
        </v-col>
        <v-col cols="2" class="text-lg-right">
          <v-chip :color="iconColor(artifactType)" class="mr-4 mt-5" label>
            <v-avatar left>
              <v-icon>{{ iconImage(artifactType) }}</v-icon>
            </v-avatar>
            <div>{{ artifactType }}</div>
          </v-chip>
        </v-col>
      </v-row>

      <v-card-text>
        <v-progress-linear
          color="light-blue"
          height="25"
          :value="artifact.progress"
          ><strong>{{ artifact.progress }}%</strong></v-progress-linear
        >
        {{ artifact.status }} - {{ artifact.phase }}
      </v-card-text>
      <v-row v-if="artifact.status === 'failed'" class="px-3">
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
        <v-btn v-if="artifact.artifact_id" text @click="deleteArtifact()">
          Delete
        </v-btn>

        <v-btn v-if="artifact.artifact_id || archived" text @click="archive()">
          Archive
        </v-btn>

        <v-btn v-else text @click="deleteImport()">
          Delete Import
        </v-btn>

        <v-btn
          v-if="artifact.artifact_id"
          :to="{
            path: `/artifact/${artifact.artifact_id}`,
            query: { edit: 'true' }
          }"
          text
        >
          Edit
        </v-btn>

        <v-btn v-if="archived === true" text @click="unarchive()">
          Unarchive
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn :disabled="!artifact.artifact_id" text @click="publish()">
          Publish
        </v-btn>

        <v-btn
          :to="`/artifact/${artifact.artifact_id}`"
          :disabled="!artifact.artifact_id"
          text
        >
          Read More
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { artifactIcon, artifactColor } from '@/helpers'

export default {
  props: {
    artifact: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    artifactType() {
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
      let response = await this.$artifactRecordEndpoint.delete(
        this.artifact.artifact_id
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

      let response = await this.$artifactRecordEndpoint.update(
        this.artifact.artifact_id,
        {
          publication: {}
        }
      )
      this.publish_local = true
      this.updateImports()
    },
    updateImports() {
      this.$store.dispatch('artifacts/fetchImports', {})
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

<style scoped>
.v-card__title {
  word-break: normal;
}
</style>
