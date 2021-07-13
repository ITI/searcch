<template>
  <div v-if="record.artifact">
    <v-card class="mx-auto my-2">
      <v-card-title> {{ record.artifact.title }} </v-card-title>
      <v-card-text>
        <a target="_blank" :href="record.artifact.url">
          {{ record.artifact.url }}
        </a>
      </v-card-text>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <v-rating
            v-model="record.avg_rating"
            color="amber"
            dense
            half-increments
            size="18"
            readonly
          ></v-rating>
          <div class="grey--text ml-4">({{ record.num_ratings }})</div>
        </v-row>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title> Description </v-card-title>

      <v-card-text>
        <div v-html="sanitizedDescription"></div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0"> Artifact Type </v-card-title>

      <v-chip :color="iconColor(record.artifact.type)" class="ma-2" label>
        <v-avatar left>
          <v-icon>{{ iconImage(record.artifact.type) }}</v-icon>
        </v-avatar>

        <div>{{ record.artifact.type }}</div>
      </v-chip>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Creators</v-card-title>

      <v-chip
        color="primary"
        v-for="c in record.artifact.affiliations"
        :key="c.id"
        cols="12"
        class="ma-2"
        label
      >
        <span v-if="c.affiliation.roles == 'Author'">
          <v-avatar left>
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          {{ c.affiliation.person.name }}
        </span>
      </v-chip>

      <span v-if="tags">
        <v-card-title class="py-0">Keywords</v-card-title>

        <v-chip
          color="primary"
          v-for="t in tags"
          :key="t[0]"
          cols="12"
          class="ma-2"
          label
          :to="{ path: `/search?keywords=${t[0]}` }"
        >
          <v-avatar left>
            <v-icon>mdi-tag-outline</v-icon>
          </v-avatar>

          {{ t[0] }}
        </v-chip>
      </span>

      <span v-if="record.artifact.relationships.length">
        <v-card-title class="py-0">Related</v-card-title>

        <v-chip
          color="primary"
          v-for="(v, k) in record.artifact.relationships"
          :key="`rel${k}`"
          cols="12"
          class="ma-2"
          label
          :to="{ path: `/artifact/${v.related_artifact_id}` }"
        >
          <v-avatar left>
            <v-icon>mdi-relation-one-to-one</v-icon>
          </v-avatar>

          {{ v.relation | titlecase }}: {{ v.related_artifact }}
        </v-chip>
      </span>

      <span v-if="badges">
        <v-card-title class="py-0">Badges</v-card-title>

        <v-chip
          color="primary"
          v-for="(v, k) in badges"
          :key="`bad${k}`"
          cols="12"
          class="ma-2"
          label
          :href="v.url"
          target="_blank"
        >
          <v-avatar left>
            <v-icon>mdi-check-decagram</v-icon>
          </v-avatar>

          {{ v.title }}
        </v-chip>
      </span>

      <v-divider class="mx-4"></v-divider>

      <span v-if="record.artifact.files.length">
        <v-card-title class="py-0">Files</v-card-title>

        <v-card-text
          v-for="(v, k) in record.artifact.files"
          :key="`file${k}`"
          cols="12"
        >
          <div>
            <a target="_blank" :href="v.url">{{ v.url }}</a> &nbsp; (type:
            {{ v.filetype }}, size: {{ convertSize(v.size) }})
          </div>
        </v-card-text>
      </span>

      <v-card-actions>
        <v-btn
          icon
          @click="favoriteThis()"
          :color="favorite == true ? 'red' : ''"
        >
          <v-icon>{{ favorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>

        <v-btn icon :to="`/artifact/review/${record.artifact.id}`" nuxt>
          <v-icon>mdi-comment</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <!-- The loading is needed because otherwise the var dereferences above would cause a failure to load if the data is not available yet -->
  <div v-else>
    {{ loadingMessage }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { artifactIcon, artifactColor, bytesToSize } from '@/helpers'

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
      loading: true,
      loadingMessage: 'Loading...'
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
      return this.$sanitize(this.record.artifact.description)
    },
    favorite: {
      get() {
        return this.favorites[this.record.artifact.id] ? true : false
      },
      set(value) {
        if (value)
          this.$store.commit('artifacts/ADD_FAVORITE', this.record.artifact.id)
        else
          this.$store.commit(
            'artifacts/REMOVE_FAVORITE',
            this.record.artifact.id
          )
      }
    },
    badges() {
      let badges = []
      let badges_raw = this.record.artifact.meta.filter(m => m.name == 'badge')
      if (!badges_raw.length) return null
      for (let b of badges_raw) {
        badges.push(JSON.parse(b.value))
      }
      return badges
    },
    tags() {
      let topics = this.record.artifact.meta.find(o => o.name == 'top_keywords')
      if (!topics) return null
      return JSON.parse(topics.value)
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
          this.$favoritesEndpoint.update(this.record.artifact.id, payload)
        } else {
          this.$favoritesEndpoint.remove(this.record.artifact.id, payload)
        }
      }
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    convertSize(size) {
      return bytesToSize(size)
    }
  }
}
</script>
