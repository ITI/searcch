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

      <div v-if="comments">
        <v-row justify="center">
          <v-expansion-panels inset multiple focusable v-model="expanded">
            <v-expansion-panel v-for="(comment, i) in comments" :key="i">
              <v-expansion-panel-header disable-icon-rotate>
                <template v-slot:actions>
                  <v-icon color="primary">mdi-comment</v-icon>
                </template>
                {{ comment.person }} -- {{ comment.title }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-rating
                  v-model="rating"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="18"
                ></v-rating>

                {{ comment.content }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </div>

      <v-card-actions>
        <v-btn icon>
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>

        <v-btn
          v-if="source === 'zenodo'"
          icon
          :to="`/artifact/comment/${id}?source=${source}`"
          nuxt
        >
          <v-icon>mdi-comment</v-icon>
        </v-btn>

        <v-btn
          v-else-if="source === 'kg'"
          icon
          :to="`/artifact/comment/?doi=${id}&source=${source}`"
          nuxt
        >
          <v-icon>mdi-comment</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          v-if="source === 'zenodo'"
          small
          replace
          color="info"
          :to="`/artifact/${id}?source=${source}`"
          nuxt
          target="_blank"
        >
          Read More
        </v-btn>

        <v-btn
          v-else-if="source === 'kg'"
          small
          replace
          color="info"
          :to="`/artifact/?doi=${id}&source=${source}`"
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
      required: true
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
    },
    comments: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      reviews: Math.floor(Math.random() * 1000 + 1),
      rating: Math.round(Math.random() * 10 + 1) / 2,
      expanded: this.comments
        ? Array(this.comments.length)
            .fill(1)
            .map(Number.call, Number)
        : []
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
