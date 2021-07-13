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

      <v-card-actions>
        <v-btn v-if="artifact.artifact_id || archived" text @click="archive()">
          Archive
        </v-btn>

        <v-btn v-else text>
          Cancel
        </v-btn>

        <v-btn
          v-if="artifact.artifact_id && !published"
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

        <v-btn
          :disabled="!artifact.artifact_id || published"
          text
          @click="publish()"
        >
          Publish{{ published ? 'ed' : '' }}
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
import clip from 'text-clipper'
import { mapState } from 'vuex'
import { artifactIcon, artifactColor } from '@/helpers'

export default {
  props: {
    artifact: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      publish_local: false
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    }),
    full_artifact() {
      return this.artifact.artifact
    },
    artifactType() {
      if (this.full_artifact) {
        if (this.full_artifact.type) return this.full_artifact.type
      }
      if (this.artifact.type == null) return 'Detecting Type...'
      return this.artifact.type
    },
    artifactTitle() {
      if (this.full_artifact) {
        if (this.full_artifact.title) return this.full_artifact.title
      }
      return this.artifact.url
    },
    published() {
      if (this.full_artifact) {
        if (this.full_artifact.publication || this.publish_local) return true
      }
      return false
    },
    archived() {
      if (this.full_artifact) {
        if (this.full_artifact.archived) return true
        else return false
      }
      return undefined
    }
  },
  methods: {
    async archive() {
      let response = await this.$importEndpoint.put(this.artifact.id, {
        archived: true
      })
      this.updateImports()
    },
    async unarchive() {
      let response = await this.$importEndpoint.put(this.artifact.id, {
        archived: false
      })
      this.updateImports()
    },
    async publish() {
      let response = await this.$artifactRecordRepository.put(
        this.full_artifact.id,
        {
          publication: {}
        }
      )
      this.publish_local = true
      this.updateImports()
    },
    updateImports() {
      if (this.user_id)
        this.$store.dispatch('artifacts/fetchImports', { userid: this.user_id })
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
