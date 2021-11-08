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
            path: `/artifact/${artifact.artifact_id}`,
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
          :to="`/artifact/${artifact.artifact_id}`"
          :disabled="!artifact.artifact_id"
          color="primary"
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
  components: {
    ArtifactChips: () => import('@/components/ArtifactChips')
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
      let response = await this.$artifactEndpoint.delete(
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

      let response = await this.$artifactEndpoint.update(
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
