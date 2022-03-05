<template>
  <div>
    <v-card class="mx-auto overflow-hidden" elevation="3">
      <v-row>
        <v-col cols="10">
          <v-card-title class="align-start">
            <div>
              <span class="headline">{{ artifact.title }}</span>
            </div>
          </v-card-title>
        </v-col>
        <v-col cols="2" class="text-lg-right">
          <ArtifactChips
            :field="[artifact.type]"
            :type="artifact.type"
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
          v-if="!related"
          :to="`/artifact/review/${artifact.id}`"
          nuxt
        >
          <v-icon>mdi-comment</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        <v-select
          v-if="related"
          label="Relationship Type"
          :items="relations"
          v-model="relation"
        ></v-select>
        <v-btn
          v-if="!related"
          color="primary"
          :to="`/artifact/${artifact.id}`"
          nuxt
        >
          Read More
        </v-btn>
        <v-btn
          v-else
          color="success"
          @click="addRelated(artifact.id, relation)"
          :disabled="relation.length == 0"
        >
          Add Related
        </v-btn>
        <v-btn
          v-if="isOwner()"
          color="success"
          :to="`/artifact/${artifact.id}?edit=true`"
          nuxt
        >
          Edit
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import clip from 'text-clipper'
import { mapState } from 'vuex'
import { artifactIcon, artifactColor, EventBus } from '@/helpers'

export default {
  props: {
    artifact: {
      type: Object,
      required: true
    },
    comments: {
      type: Array,
      required: false
    },
    related: {
      type: Boolean,
      required: false
    }
  },
  components: {
    ArtifactChips: () => import('@/components/ArtifactChips')
  },
  data() {
    return {
      expanded: this.comments
        ? Array(this.comments.length)
            .fill(1)
            .map(Number.call, Number)
        : [],
      relations: [
        'cites',
        'supplements',
        'extends',
        'uses',
        'describes',
        'requires',
        'processes',
        'produces'
      ],
      relation: ''
    }
  },
  computed: {
    ...mapState({
      favorites: state => state.artifacts.favoritesIDs,
      userid: state => state.user.userid,
      user_is_admin: state => state.user.user_is_admin
    }),
    sanitizedDescription: function() {
      let description = ''
      description = this.artifact.description
      return clip(this.$sanitize(description), 2000, {
        html: true,
        maxLines: 40
      })
    },
    favorite: {
      get() {
        return this.favorites[this.artifact.id] ? true : false
      },
      set(value) {
        if (value)
          this.$store.commit('artifacts/ADD_FAVORITE', this.artifact.id)
        else this.$store.commit('artifacts/REMOVE_FAVORITE', this.artifact.id)
      }
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
          await this.$favoritesEndpoint.post(this.artifact.id, {})
        } else {
          await this.$favoritesEndpoint.delete(this.artifact.id)
        }
      }
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    addRelated(id, relation) {
      this.$store.dispatch('artifacts/setRelated', {
        id: id,
        relation: relation
      })
      EventBus.$emit('close', 'artifactdialog')
    },
    isOwner() {
      if (this.user_is_admin) return true
      return typeof this.artifact.owner !== 'undefined'
        ? this.artifact.owner.id == this.userid
        : false
    }
  }
}
</script>

<style scoped>
.v-card__title {
  word-break: normal;
}
</style>
