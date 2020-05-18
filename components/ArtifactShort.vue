<template>
  <div>
    <v-card class="mx-auto overflow-hidden">
      <v-card-title class="align-start">
        <div>
          <span class="headline">{{ artifact.title | titlecase }}</span>
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

      <v-card-text v-if="artifact.score">
        <span class="pl-2 grey--text text--darken-2 font-weight-light caption">
          Relevance Score
        </span>
        <v-spacer></v-spacer>

        <div class="my-4 subtitle-1"></div>
        <div>{{ artifact.score }}</div>
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
          :to="`/artifact/comment/${artifact.id}`"
          nuxt
        >
          <v-icon>mdi-comment</v-icon>
        </v-btn>

        <v-btn
          v-else-if="source === 'kg'"
          icon
          :to="`/artifact/comment/?doi=${artifact.id}`"
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
          :to="`/artifact/${artifact.id}`"
          nuxt
        >
          Read More
        </v-btn>

        <v-btn
          v-else-if="source === 'kg'"
          small
          replace
          color="info"
          :to="`/artifact/?doi=${artifact.id}`"
          nuxt
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
    ...mapState({
      source: state => state.artifacts.source
    }),
    sanitizedDescription: function() {
      let description = ''
      if (this.source === 'zenodo') {
        description = this.artifact.metadata.description
      } else {
        description = this.artifact.description
      }
      return clip(this.$sanitize(description), 2000, {
        html: true,
        maxLines: 40
      })
    }
  }
}
</script>
