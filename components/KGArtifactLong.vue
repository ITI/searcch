<template>
  <div v-if="record.artifact">
    <h1>
      Knowledge Graph Artifact
      <a :href="`http://doi.org/${record.artifact.id}`" target="_blank">
        {{ record.artifact.id }}
      </a>
    </h1>

    <v-card class="mx-auto my-12">
      <v-card-title> {{ record.artifact.title }} </v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <v-rating
            v-model="rating"
            color="amber"
            dense
            half-increments
            size="18"
          ></v-rating>
          <div class="grey--text ml-4">{{ rating }} ({{ reviews }})</div>
        </v-row>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title> Description </v-card-title>

      <v-card-text>
        <div v-html="sanitizedDescription"></div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title> Artifact Type </v-card-title>

      <v-chip color="primary" class="ma-2" label>
        <v-avatar left>
          <v-icon>mdi-newspaper-variant-outline</v-icon>
        </v-avatar>

        <div>{{ record.artifact.type }}</div>
      </v-chip>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Creators</v-card-title>

      <v-chip
        color="primary"
        v-for="c in record.affiliations"
        :key="c.id"
        cols="12"
        class="ma-2"
        label
      >
        <span v-if="c.roles == 'Author'">
          <v-avatar left>
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          {{ c.person.name }}
        </span>
      </v-chip>

      <v-card-title>Keywords</v-card-title>

      <v-chip
        color="primary"
        v-for="(v, k) in record.artifact.tags"
        :key="k"
        cols="12"
        class="ma-2"
        label
        @click="search"
      >
        <v-avatar left>
          <v-icon>mdi-tag-outline</v-icon>
        </v-avatar>

        {{ v.tag }}
      </v-chip>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Files</v-card-title>

      <v-card-text v-for="(v, k) in record.artifact.files" :key="k" cols="12">
        <div>
          <a :href="v.url">{{ k }}</a> (type: {{ v.filetype }}, size: {{ v.size }} bytes)
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          icon
          @click="favorite = true"
          :color="favorite == true ? 'pink' : ''"
        >
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>

        <v-btn icon :to="`/artifact/comment/${record.artifact.id}`" nuxt>
          <v-icon>mdi-comment</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <!-- The loading is needed because otherwise the var dereferences above would cause a failure to load if the data is not available yet -->
  <div v-else>
    Loading...
  </div>
</template>

<script>
export default {
  name: 'KGArtifactLong',
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      reviews: Math.floor(Math.random() * 1000 + 1),
      rating: Math.round(Math.random() * 10 + 1) / 2,
      favorite: false
    }
  },
  computed: {
    sanitizedDescription: function() {
      return this.$sanitize(this.record.artifact.description)
    },
    relevanceColor: {
      get() {
        if (this.record.artifact.relevance_score <= 60) {
          return 'error'
        } else if (
          this.record.artifact.relevance_score > 60 &&
          this.record.artifact.relevance_score <= 90
        ) {
          return 'warning'
        } else {
          return 'success'
        }
      }
    }
  },
  methods: {
    search() {
      alert('searching')
    }
  }
}
</script>
