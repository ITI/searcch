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

      <v-card-title>
        <v-row class="mx-1"
          >Description<v-spacer></v-spacer
          ><v-btn v-if="isOverflow" @click="expanded = !expanded">{{
            !expanded ? 'Expand' : 'Collapse'
          }}</v-btn></v-row
        >
      </v-card-title>

      <v-card-text ref="descDiv" :class="hideOverflow">
        <vue-markdown :source="markdown"></vue-markdown>
      </v-card-text>
      <v-btn
        elevation="0"
        tile
        v-if="isOverflow"
        @click="expanded = !expanded"
        block
        ><v-icon>{{ overflowIcon }}</v-icon></v-btn
      >

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0 mt-2"> Artifact Type </v-card-title>

      <v-chip color="purple white--text" class="ma-2" label>
        <v-avatar left>
          <v-icon>mdi-code-braces</v-icon>
        </v-avatar>

        <div>{{ record.artifact.type }}</div>
      </v-chip>

      <span v-if="homepage">
        <v-card-title class="py-0">Home Page</v-card-title>

        <v-chip
          color="primary"
          cols="12"
          class="ma-2"
          label
          :href="homepage"
          target="_blank"
        >
          <v-avatar left>
            <v-icon>mdi-link-variant</v-icon>
          </v-avatar>

          {{ homepage }}
        </v-chip>
      </span>

      <span v-if="authors">
        <v-card-title class="py-0">Creators</v-card-title>

        <v-chip
          color="primary"
          v-for="a in authors"
          :key="a.id"
          cols="12"
          class="ma-2"
          label
        >
          <v-avatar left>
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          {{ a.affiliation.person.name }}
        </v-chip>
      </span>

      <span v-if="languages">
        <v-card-title class="py-0">Languages</v-card-title>

        <v-chip
          color="primary"
          v-for="(v, k) in languages"
          :key="`lang${k}`"
          cols="12"
          class="ma-2"
          label
        >
          <v-avatar left>
            <v-icon>mdi-code-brackets</v-icon>
          </v-avatar>

          {{ v }}
        </v-chip>
      </span>

      <span v-if="tags">
        <v-card-title class="py-0">Keywords</v-card-title>

        <v-chip
          color="primary"
          v-for="(v, k) in tags"
          :key="`tag${k}`"
          cols="12"
          class="ma-2"
          label
          :to="{ path: `/search?keywords=${v}` }"
        >
          <v-avatar left>
            <v-icon>mdi-tag-outline</v-icon>
          </v-avatar>

          {{ v }}
        </v-chip>
      </span>

      <span v-if="stars || watchers">
        <v-card-title class="py-0">Github Metrics</v-card-title>

        <v-chip color="primary" cols="12" class="ma-2" label>
          <v-avatar left>
            <v-icon color="yellow">mdi-star</v-icon>
          </v-avatar>

          {{ stars }}
        </v-chip>
        <v-chip color="primary" cols="12" class="ma-2" label>
          <v-avatar left>
            <v-icon>mdi-eye</v-icon>
          </v-avatar>

          {{ watchers }}
        </v-chip>
      </span>

      <v-card-title class="py-0">Importer</v-card-title>

      <v-chip color="primary" cols="12" class="ma-2" label>
        <v-avatar left>
          <v-icon>mdi-file-download-outline</v-icon>
        </v-avatar>
        <span v-if="record.artifact.importer">
          {{
            `${record.artifact.importer.name} v${record.artifact.importer.version}`
          }}
        </span>
      </v-chip>

      <span v-if="license">
        <v-card-title v-if="license" class="py-0">License</v-card-title>
        <v-chip color="primary" cols="12" class="ma-2" label>
          <v-avatar left>
            <v-icon>mdi-scale-balance</v-icon>
          </v-avatar>

          {{ license }}
        </v-chip>
      </span>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0 mt-2">Files</v-card-title>

      <v-list-item
        v-for="(v, k) in record.artifact.files"
        :key="`file${k}`"
        dense
      >
        <v-list-group :value="true" no-action sub-group>
          <template v-slot:activator>
            <a @click.stop target="_blank" :href="v.url">{{ v.url }}</a> &nbsp;
            (type: {{ v.filetype }}, size: {{ bytesToSize(v.size) }})
          </template>
          <v-list-item v-for="(vm, km) in v.members" :key="`mem${km}`" dense>
            <a target="_blank" :href="vm.html_url || vm.download_url">{{
              vm.pathname || vm.name || vm.html_url || vm.download_url
            }}</a>
            &nbsp; (type: {{ vm.filetype }}, size: {{ bytesToSize(vm.size) }})
          </v-list-item>
        </v-list-group>
      </v-list-item>

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
      loaded: false,
      expanded: false,
      loadingMessage: 'Loading...'
    }
  },
  mounted() {
    this.loaded = true
    setTimeout(() => {
      this.loadingMessage = 'Error loading'
    }, 5000)
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
    authors() {
      let authors = []
      for (let a of this.record.artifact.affiliations) {
        if (a.affiliation.roles == 'Author') authors.push(a)
      }
      if (!authors.length) return null
      return authors
    },
    languages() {
      let csv = this.record.artifact.meta.find(o => o.name == 'languages')
      if (!csv) return null
      return csv.value.split(',')
    },
    homepage() {
      let hp = this.record.artifact.meta.find(o => o.name == 'homepage')
      if (!hp) return null
      return hp.value
    },
    stars() {
      let stars = this.record.artifact.meta.find(
        o => o.name == 'stargazers_count'
      )
      if (!stars) return null
      return stars.value
    },
    watchers() {
      let watchers = this.record.artifact.meta.find(
        o => o.name == 'watchers_count'
      )
      if (!watchers) return null
      return watchers.value
    },
    license() {
      let license = this.record.artifact.license
      if (!license) return null
      return license.long_name
    },
    tags() {
      let tags = []
      let topics = this.record.artifact.meta.find(o => o.name == 'topics')
      if (!topics) return null
      tags = topics.value.split(',').map(t =>
        t
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      )
      return tags
    },
    markdown() {
      let readme = this.record.artifact.files.some(f => {
        readme = f.members.find(f => f.name == 'README.md')
        if (readme) return true
      })
      return readme.content
    },
    hideOverflow() {
      return {
        hideoverflow: !this.expanded
      }
    },
    isOverflow() {
      if (!this.loaded) return false
      let element = this.$refs['descDiv']
      return element.offsetHeight >= 700
    },
    overflowIcon() {
      if (!this.expanded) return 'mdi-chevron-down'
      else return 'mdi-chevron-up'
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
      if (bytes == 0 || bytes == null) return '0 Bytes'
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    }
  }
}
</script>

<style scoped>
.hideoverflow {
  max-height: 700px;
  overflow: hidden;
}
</style>
