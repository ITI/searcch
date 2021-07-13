<template>
  <div>
    <v-card
      class="mx-auto overflow-hidden"
      elevation="3"
      v-if="artifact.artifact"
    >
      <v-row class="px-3">
        <v-card-title class="align-start">
          <div>
            <span class="headline">{{
              artifact.artifact.title | titlecase
            }}</span>
          </div>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-chip
          v-if="artifact.artifact.type"
          :color="iconColor(artifact.artifact.type)"
          class="ma-2 mt-5"
          label
        >
          <v-avatar left>
            <v-icon>{{ iconImage(artifact.artifact.type) }}</v-icon>
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
          <SingleComment
            class="mt-2"
            outlined
            tile
            v-for="(comment, i) in commentsReordered"
            :comment="comment"
            :key="i"
          ></SingleComment>
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

        <v-btn small :to="`/artifact/${artifact.artifact.id}`" nuxt>
          Read More
        </v-btn>
      </v-card-actions>
    </v-card>
    <span v-else>{{ loadingMessage }}</span>
  </div>
</template>

<script>
import SingleComment from '@/components/SingleComment'
import clip from 'text-clipper'
import { mapState } from 'vuex'
import { artifactIcon, artifactColor } from '@/helpers'

export default {
  components: {
    SingleComment
  },
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
      loadingMessage: 'Loading...',
      expanded: this.comments
        ? Array(this.comments.length)
            .fill(1)
            .map(Number.call, Number)
        : []
    }
  },
  mounted() {
    setTimeout(() => {
      this.loadingMessage = 'Error loading'
    }, 5000)
  },
  computed: {
    ...mapState({
      source: state => state.artifacts.source,
      userid: state => state.user.userid,
      favorites: state => state.artifacts.favoritesIDs
    }),
    sanitizedDescription: function() {
      let description = ''
      description = this.artifact.artifact.description
      let out = clip(this.$sanitize(description), 2000, {
        html: true,
        maxLines: 40
      })
      if (out == 'null') return '<br>'
      else return out
    },
    favorite: {
      get() {
        return this.favorites[this.artifact.artifact.id] ? true : false
      },
      set(value) {
        if (value)
          this.$store.commit(
            'artifacts/ADD_FAVORITE',
            this.artifact.artifact.id
          )
        else
          this.$store.commit(
            'artifacts/REMOVE_FAVORITE',
            this.artifact.artifact.id
          )
      }
    },
    commentsReordered() {
      let first = []
      let rest = []
      for (let comment of this.comments) {
        if (comment.review.reviewer.id === this.userid) first.push(comment)
        else rest.push(comment)
      }
      return first.concat(rest)
    }
  },
  methods: {
    favoriteThis() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        let action = !this.favorite
        this.favorite = !this.favorite
        let payload = {
          token: this.$auth.getToken('github'),
          userid: this.userid
        }
        if (action) {
          this.$favoritesEndpoint.update(this.artifact.artifact.id, payload)
        } else {
          this.$favoritesEndpoint.remove(this.artifact.artifact.id, payload)
        }
      }
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    }
  }
}
</script>
