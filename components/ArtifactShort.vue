<template>
  <div>
    <v-card class="mx-auto overflow-hidden">
      <v-card-title class="align-start">
        <div>
          <span class="headline">{{ title | titlecase }}</span>
        </div>
      </v-card-title>
      <v-card-text>
        <span class="pl-2 grey--text text--darken-2 font-weight-light caption">
          {{ reviews }} reviews
        </span>
        <v-spacer></v-spacer>
        <v-rating
          v-model="rating"
          color="amber"
          dense
          half-increments
          readonly
          size="18"
        ></v-rating>
      </v-card-text>

      <v-card-text v-if="score">
        <span class="pl-2 grey--text text--darken-2 font-weight-light caption">
          Relevance Score
        </span>
        <v-spacer></v-spacer>

        <div class="my-4 subtitle-1"></div>
        <div>{{ score }}</div>
      </v-card-text>

      <v-card-text v-html="sanitizedDescription"> </v-card-text>

      <v-card-actions v-if="source === 'zenodo'">
        <v-btn icon>
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>

        <v-btn icon :to="`/artifact/comment/${id}?source=${source}`" nuxt>
          <v-icon>mdi-comment</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          small
          replace
          color="info"
          :to="`/artifact/${id}?source=${source}`"
          nuxt
          target="_blank"
        >
          Read More
        </v-btn>
      </v-card-actions>

      <v-card-actions v-else-if="source === 'kg'">
        <v-btn icon>
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>

        <v-btn icon :to="`/artifact/?doi=${doi}&source=${source}`" nuxt>
          <v-icon>mdi-comment</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          small
          replace
          color="info"
          :to="`/artifact/?doi=${doi}&source=${source}`"
          nuxt
          target="_blank"
        >
          Read More
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import clip from 'text-clipper'

export default {
  props: {
    source: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: false
    },
    doi: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: false
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
      return clip(this.$sanitize(this.description), 2000, {
        html: true,
        maxLines: 40
      })
    }
  }
}
</script>
