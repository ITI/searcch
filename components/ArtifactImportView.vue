<template>
  <div>
    <v-card class="mx-auto overflow-hidden" elevation="3">
      <v-row class="px-3">
        <v-card-title class="align-start">
          <div>
            <span class="headline">{{ artifact.id }}:&nbsp;{{  }}</span>
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
    }
  },
  data() {
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
      if (this.artifact.type == "dataset") return "mdi-database"
      return "mdi-help"
    },
    artifactColor () {
      if (this.artifact.type == "publication") return "info"
      if (this.artifact.type == "code") return "purple white--text"
      if (this.artifact.type == "dataset") return "green white--text"
      return "warning"
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
