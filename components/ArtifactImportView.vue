<template>
  <div>
    <v-card tile class="mx-auto overflow-hidden" elevation="3">
      <v-row class="px-3">
        <v-card-title class="align-start">
          <div>
            <span class="headline">Import ID {{ artifact.id }}:&nbsp;<a target="_blank" :href="artifact.url">{{ artifactTitle }}</a></span>
          </div>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-chip :color="artifactColor" class="mr-4 mt-5" label>
          <v-avatar left>
            <v-icon>{{ artifactIcon }}</v-icon>
          </v-avatar>
          <div>{{ artifactType }}</div>
        </v-chip>
      </v-row>

      <v-card-text> 
        <v-progress-linear
          color="light-blue"
          height="25"
          :value="artifact.progress"
        ><strong>{{ artifact.progress }}%</strong></v-progress-linear>
        {{ artifact.status }} - {{ artifact.phase }}
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="artifact.artifact_id || archived"
          text
          @click="archive()"
        >
          Archive
        </v-btn>
        

        <v-btn
          v-else
          text
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="archived === true"
          text
          @click="unarchive()"
        >
          Unarchive
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          :disabled="!artifact.artifact_id || published"
          text
          @click="publish()"
        >
          Publish{{ published ? "ed" : "" }}
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

export default {
  props: {
    artifact: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      full_artifact: this.artifact.artifact,
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
    }),
    artifactType () {
      if (this.full_artifact) {
        if (this.full_artifact.type) return this.full_artifact.type
      }
      if (this.artifact.type == null) return "Detecting Type..."
      return this.artifact.type
    },
    artifactIcon () {
      let type = this.artifactType
      if (type == "publication") return "mdi-newspaper-variant-outline"
      if (type == "code") return "mdi-code-braces"
      if (type == "dataset") return "mdi-database"
      return "mdi-magnify"
    },
    artifactColor () {
      let type = this.artifactType
      if (type == "publication") return "info"
      if (type == "code") return "purple white--text"
      if (type == "dataset") return "green white--text"
      return "warning"
    },
    artifactTitle () {
      if (this.full_artifact) {
        if (this.full_artifact.title) return this.full_artifact.title
      }
      return this.artifact.url
    },
    published () {
      if (this.full_artifact) {
        if (this.full_artifact.published) return true
      }
      return false
    },
    archived () {
      if (this.full_artifact) {
        if (this.full_artifact.archived) return true
        else return false
      }
      return undefined
    },
  },
  methods:{
    async archive () {
      let response = await this.$importEndpoint.put(this.artifact.id, {
        archived: true,
      })
      console.log(response)
    },
    async unarchive () {
      let response = await this.$importEndpoint.put(this.artifact.id, {
        archived: false,
      })
      console.log(response)
    },
    async publish () {
      let response = await this.$importEndpoint.put(this.artifact.id, {
        published: true,
      })
      console.log(response)
    },
  }
}
</script>
