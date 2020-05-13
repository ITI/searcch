<template>
  <div>
    <h1>
      Knowledge Graph Artifact
      <a href="#" target="_blank">
        {{ record.doi }}
      </a>
    </h1>

    <v-card class="mx-auto my-12">
      <v-card-title> {{ record.title }} </v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <v-rating
            v-model="rating"
            color="amber"
            dense
            half-increments
            hover
            size="18"
          ></v-rating>
          <div class="grey--text ml-4">{{ rating }} ({{ reviews }})</div>
        </v-row>
      </v-card-text>

      <v-card-title> Description </v-card-title>

      <v-card-text>
        <div v-html="sanitizedDescription"></div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title> Artifact Type </v-card-title>

      <v-card-text>
        <div v-if="record.resource_type">{{ record.resource_type.title }}</div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title> Relevance Score </v-card-title>

      <v-card-text>
        <div>{{ record.relevance_score }}</div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Creators</v-card-title>

      <v-card-text v-for="c in record.creators" :key="c.name" cols="12">
        <div>
          {{ c.name }}
        </div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Keywords</v-card-title>

      <v-card-text v-for="(v, k) in record.keywords" :key="k" cols="12">
        <div>
          {{ v }}
        </div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Files</v-card-title>

      <v-card-text v-for="(v, k) in record.files" :key="v.key" cols="12">
        <div>
          <a :href="v.links.self">{{ v.key }}</a> (size: {{ v.size }} bytes)
        </div>
      </v-card-text>
    </v-card>
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
      reviews: Math.floor(Math.random() * 1000 + 1),
      rating: Math.round(Math.random() * 10 + 1) / 2
    }
  },
  computed: {
    sanitizedDescription: function() {
      return this.$sanitize(this.record.description)
    }
  }
}
</script>
