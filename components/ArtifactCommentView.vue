<template>
  <div>
    <v-card
      class="mx-auto overflow-hidden"
      elevation="3"
      v-if="artifact.artifact"
    >
      <v-row>
        <v-col cols="10">
          <v-card-title class="align-start">
            <div>
              <span class="headline">{{
                artifact.artifact.title
              }}</span>
            </div>
          </v-card-title>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <ArtifactChips
            :field="[artifact.artifact.type]"
            :type="artifact.artifact.type"
          ></ArtifactChips>
        </v-col>
      </v-row>

      <span class="ml-4 grey--text text--darken-2 font-weight-light caption">
        {{ artifact.num_reviews }}
        {{ artifact.num_reviews == 1 ? 'review' : 'reviews' }}
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

        <v-btn color="primary" :to="`/artifact/${artifact.artifact.id}`" nuxt>
          Read More
        </v-btn>
      </v-card-actions>
    </v-card>
    <div v-else>{{ loadingMessage }}</div>
  </div>
</template>

<script>
import clip from 'text-clipper'
import { mapState } from 'vuex'
import { artifactIcon, artifactColor } from '@/helpers'

export default {
  components: {
    SingleComment: () => import('@/components/SingleComment'),
    ArtifactChips: () => import('@/components/ArtifactChips')
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
    async favoriteThis() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        let action = !this.favorite
        this.favorite = !this.favorite
        if (action) {
          // FIXME: backend API
          await this.$favoritesEndpoint.post(this.artifact.artifact.id, {})
        } else {
          await this.$favoritesEndpoint.delete(this.artifact.artifact.id)
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
