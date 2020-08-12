<template>
  <div>
    <v-card class="mx-auto overflow-hidden">
      <v-chip
        v-if="artifact.relevance_score"
        :color="relevanceColor"
        class="ma-2"
        label
      >
        <v-avatar left>
          <v-icon>mdi-finance</v-icon>
        </v-avatar>
        {{ artifact.relevance_score }}
      </v-chip>

      <v-chip v-if="artifact.type" color="primary" class="ma-2" label>
        <v-avatar left>
          <v-icon>mdi-newspaper-variant-outline</v-icon>
        </v-avatar>
        <div v-if="artifact.type">{{ artifact.type }}</div>
      </v-chip>

      <v-card-title class="align-start">
        <div>
          <span class="headline">{{ artifact.title | titlecase }}</span>
        </div>
      </v-card-title>

      <v-spacer></v-spacer>

      <span class="pl-2 grey--text text--darken-2 font-weight-light caption">
        {{ reviews }} reviews
      </span>
      <v-rating
        v-model="rating"
        color="amber"
        dense
        half-increments
        readonly
        size="18"
      ></v-rating>

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
                  v-model="comment.rating"
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
    },
    relevanceColor: {
      get() {
        if (this.artifact.relevance_score <= 0.4) {
          return 'error'
        } else if (
          this.artifact.relevance_score > 0.4 &&
          this.artifact.relevance_score <= 0.8
        ) {
          return 'warning'
        } else {
          return 'success'
        }
      }
    }
  }
}
</script>
