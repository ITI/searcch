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
          <div class="grey--text ml-4">{{ rating }} (42)</div>
        </v-row>
      </v-card-text>

      <v-card-text>
        <div class="my-4 subtitle-1">
          Description
        </div>
        <div v-html="record.description"></div>
      </v-card-text>

      <v-card-text>
        <div class="my-4 subtitle-1">
          Relevance Score
        </div>
        <div v-html="record.relevance_score"></div>
      </v-card-text>

      <v-card-text>
        <div class="my-4 subtitle-1">
          TFIDF Score
        </div>
        <div v-html="record.tfidf_score"></div>
      </v-card-text>

      <v-card-text>
        <div class="my-4 subtitle-1">
          TFIDF Score Probability
        </div>
        <div v-html="record.tfidf_score_prob"></div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Creators</v-card-title>

      <v-card-text v-for="(v, k) in record.creators" :key="k" cols="12">
        <div class="my-4 subtitle-1">
          {{ k }}
        </div>
        <div v-html="v"></div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Files</v-card-title>

      <v-card-text v-for="(v, k) in record.files" :key="k" cols="12">
        <div class="my-4 subtitle-1">
          {{ k }}
        </div>
        <div v-html="v"></div>
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
      rating: 4.5
    }
  }
}
</script>
