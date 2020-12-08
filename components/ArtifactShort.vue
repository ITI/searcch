<template>
  <div>
    <v-card class="mx-auto overflow-hidden" elevation="3">
      <v-row class="px-3">
        <v-card-title class="align-start">
          <div>
            <span class="headline">{{ artifact.title | titlecase }}</span>
          </div>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-chip v-if="artifact.type" :color="artifactColor" class="ma-2" label>
          <v-avatar left>
            <v-icon>{{ artifactIcon }}</v-icon>
          </v-avatar>
          <div v-if="artifact.type">{{ artifact.type }}</div>
        </v-chip>
      </v-row>

      <span class="ml-4 grey--text text--darken-2 font-weight-light caption">
        {{ artifact.num_reviews }} reviews
      </span>
      <v-rating
        v-model="artifact.avg_rating"
        color="amber"
        dense
        half-increments
        readonly
        size="18"
        class="ml-3"
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
        <v-btn
          icon
          @click="favoriteThis()"
          :color="favorite == true ? 'red' : ''"
        >
          <v-icon>{{ favorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>

        <v-btn
          icon
          :to="`/artifact/comment/${artifact.id}`"
          nuxt
        >
          <v-icon>mdi-comment</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          small
          replace
          :to="`/artifact/${artifact.id}`"
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
      expanded: this.comments
        ? Array(this.comments.length)
            .fill(1)
            .map(Number.call, Number)
        : [],
    }
  },
  computed: {
    ...mapState({
      source: state => state.artifacts.source,
      user_id: state => state.user.user_id,
      favorites: state => state.artifacts.favoritesIDs
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
    favorite: {
      get () {
        return this.favorites[this.artifact.id] ? true : false
      },
      set (value) {
        if (value) this.$store.commit('artifacts/ADD_FAVORITE', this.artifact.id)
        else this.$store.commit('artifacts/REMOVE_FAVORITE', this.artifact.id)
      }
    },
    artifactIcon () {
      if (this.artifact.type == "publication") return "mdi-newspaper-variant-outline"
      if (this.artifact.type == "code") return "mdi-code-braces"
    },
    artifactColor () {
      if (this.artifact.type == "publication") return "info"
      if (this.artifact.type == "code") return "purple white--text"
    }
  },
  methods:{
    favoriteThis () {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        let action = !this.favorite
        this.favorite = !this.favorite
        let payload = {
          api_key: process.env.KG_API_KEY,
          token: this.$auth.getToken('github'),
          userid: this.user_id
        }
        if (action) {
          this.$favoritesEndpoint.update(this.artifact.id, payload)
        } else {
          this.$favoritesEndpoint.remove(this.artifact.id, payload)
        }
      }
    }
  }
}
</script>
