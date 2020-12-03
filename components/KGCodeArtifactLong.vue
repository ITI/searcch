<template>
  <div v-if="record.artifact">
    <h3>
      <a target="_blank" :href="record.artifact.url">  Knowledge Graph Artifact {{ record.artifact.id }} </a>
    </h3>
    <v-card class="mx-auto my-2">
      <v-card-title> {{ record.artifact.title }} </v-card-title>

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
        <vue-markdown :source="markdown"></vue-markdown>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0 mt-2"> Artifact Type </v-card-title>

      <v-chip color="primary" class="ma-2" label>
        <v-avatar left>
          <v-icon>mdi-code-braces</v-icon>
        </v-avatar>

        <div>{{ record.artifact.type }}</div>
      </v-chip>


      <v-card-title class="py-0">Creators</v-card-title>

      <v-chip
        color="primary"
        v-for="c in record.affiliations"
        :key="c.id"
        cols="12"
        class="ma-2"
        label
      >
        <span v-if="c.roles == 'Author'">
          <v-avatar left>
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          {{ c.person.name }}
        </span>
      </v-chip>

      <v-card-title class="py-0">Languages</v-card-title>

      <v-chip
        color="primary"
        v-for="(v, k) in languages"
        :key="`chip${k}`"
        cols="12"
        class="ma-2"
        label
        @click="search"
      >
        <v-avatar left>
          <v-icon>mdi-tag-outline</v-icon>
        </v-avatar>

        {{ v }}
      </v-chip>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0 mt-2">Files</v-card-title>

      <v-card-text  cols="12">
        <v-list CLASS="ma-0">
          <v-list-item v-for="(v, k) in record.artifact.files" :key="`file${k}`" dense>
            <a target="_blank" :href="v.url">{{ v.url }}</a> (type: {{ v.filetype }}, size: {{ bytesToSize(v.size) }})
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-btn
          icon
          @click="favoriteThis()"
          :color="favorite == true ? 'red' : ''"
        >
          <v-icon>{{ favorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>

        <v-btn icon :to="`/artifact/comment/${record.artifact.id}`" nuxt>
          <v-icon>mdi-comment</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <!-- The loading is needed because otherwise the var dereferences above would cause a failure to load if the data is not available yet -->
  <div v-else>
    Loading...
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'KGArtifactLong',
  components: {
    VueMarkdown
  },
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    ...mapState({
      source: state => state.artifacts.source,
      user_id: state => state.user.user_id,
      favorites: state => state.artifacts.favoritesIDs
    }),
    sanitizedDescription: function() {
      return this.$sanitize(this.record.artifact.description)
    },
    favorite: {
      get () {
        return this.favorites[this.record.artifact.id] ? true : false
      },
      set (value) {
        if (value) this.$store.commit('artifacts/ADD_FAVORITE', this.record.artifact.id)
        else this.$store.commit('artifacts/REMOVE_FAVORITE', this.record.artifact.id)
      }
    },
    languages () {
      let csv = this.record.artifact.meta.find(o => o.name == "languages")
      console.log(csv)
      return csv.value.split(',')
    },
    markdown () {
      let file = this.record.artifact.files.find(f => f.url == "README.md")
      if (!file) return ''
      return file.content
    }
  },
  methods: {
    search() {
      alert('searching')
    },
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
          this.$favoritesEndpoint.update(this.record.artifact.id, payload)
        } else {
          this.$favoritesEndpoint.remove(this.record.artifact.id, payload)
        }
      }
    },
    bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes == 0 || bytes == null) return '0 Byte'
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    }
  }
}
</script>
