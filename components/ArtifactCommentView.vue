<template>
  <div>
    <v-card class="mx-auto overflow-hidden" elevation="3" v-if="artifact.artifact">
      <v-row class="px-3">
        <v-card-title class="align-start">
          <div>
            <span class="headline">{{ artifact.artifact.title | titlecase }}</span>
          </div>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-chip v-if="artifact.artifact.type" color="primary" class="ma-2" label>
          <v-avatar left>
            <v-icon>{{ artifactIcon }}</v-icon>
          </v-avatar>
          <div v-if="artifact.artifact.type">{{ artifact.artifact.type }}</div>
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
        <v-container fluid>
          <v-card outlined tile v-for="(comment, i) in comments" :key="i">
            <v-card-text>
              {{ comment.review }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                v-if="user_id == comment.reviewer.id"
                text
                color="primary"
                @click="deleteReview(comment.id)"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </div>

      <v-card-actions>
        <v-btn
          icon
          @click="favoriteThis()"
          :color="favorite == true ? 'red' : ''"
        >
          <v-icon>{{ favorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          small
          replace
          color="info"
          :to="`/artifact/${artifact.artifact.id}`"
          nuxt
        >
          Read More
        </v-btn>
      </v-card-actions>
    </v-card>
    <span v-else>Loading...</span>
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
        description = this.artifact.artifact.description
      }
      return clip(this.$sanitize(description), 2000, {
        html: true,
        maxLines: 40
      })
    },
    favorite: {
      get () {
        return this.favorites[this.artifact.artifact.id] ? true : false
      },
      set (value) {
        if (value) this.$store.commit('artifacts/ADD_FAVORITE', this.artifact.artifact.id)
        else this.$store.commit('artifacts/REMOVE_FAVORITE', this.artifact.artifact.id)
      }
    },
    artifactIcon () {
      if (this.artifact.artifact.type == "publication") return "mdi-newspaper-variant-outline"
      if (this.artifact.artifact.type == "code") return "mdi-code-braces"
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
          this.$favoritesEndpoint.update(this.artifact.artifact.id, payload)
        } else {
          this.$favoritesEndpoint.remove(this.artifact.artifact.id, payload)
        }
      }
    },
    async deleteReview (id) {
      let rating_payload = {
        api_key: process.env.KG_API_KEY,
        token: this.$auth.getToken('github'),
        userid: this.user_id
      }
      await this.$ratingsEndpoint.remove(this.artifact.artifact.id, rating_payload)
      let comment_payload = {
        api_key: process.env.KG_API_KEY,
        token: this.$auth.getToken('github'),
        userid: this.user_id,
        reviewid: id
      }
      await this.$reviewsEndpoint.remove(this.artifact.artifact.id, comment_payload)
      this.$store.dispatch('artifacts/fetchArtifact', {
        id: this.$route.params.id,
        source: 'kg'
      })
    }
  }
}
</script>
