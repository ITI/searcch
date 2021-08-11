<template>
  <div v-if="record.artifact">
    <v-card class="mx-auto my-2">
      <v-card-title> {{ record.artifact.title | titlecase }} </v-card-title>
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

      <v-card-title>Description</v-card-title>

      <v-card-text ref="descDiv" :class="hideOverflow">
        <div v-html="sanitizedDescription"></div>
      </v-card-text>

      <div v-if="record.artifact.type === 'code'">
        <v-divider class="mx-4"></v-divider>
        <v-card-title>
          <v-row class="mx-1"
            >Readme<v-spacer></v-spacer
            ><v-btn v-if="isOverflow" @click="expanded = !expanded">{{
              !expanded ? 'Expand' : 'Collapse'
            }}</v-btn></v-row
          >
        </v-card-title>
        <v-card-text>
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
      </div>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0"> Artifact Type </v-card-title>

      <v-chip :color="iconColor(record.artifact.type)" class="ma-2" label>
        <v-avatar left>
          <v-icon>{{ iconImage(record.artifact.type) }}</v-icon>
        </v-avatar>

        <div>{{ record.artifact.type | titlecase }}</div>
      </v-chip>

      <v-divider class="mx-4"></v-divider>

      <div v-if="record.artifact.affiliations">
        <v-card-title class="py-0">Roles</v-card-title>
        <ArtifactChips
          :field="record.artifact.affiliations"
          type="role"
          display
        ></ArtifactChips>

        <v-divider class="mx-4"></v-divider>
      </div>

      <div v-if="tags.length">
        <v-card-title class="py-0">Keywords</v-card-title>
        <ArtifactChips
          :field="tags"
          type="keyword"
          display
          link
        ></ArtifactChips>

        <v-divider class="mx-4"></v-divider>
      </div>

      <div v-if="languages.length > 0">
        <v-card-title class="py-0">Languages</v-card-title>
        <ArtifactChips :field="languages" type="code" display></ArtifactChips>

        <v-divider class="mx-4"></v-divider>
      </div>

      <div v-if="record.artifact.relationships.length">
        <v-card-title class="py-0">Related</v-card-title>

        <ArtifactChips
          :field="record.artifact.relationships"
          type="relation"
          display
          link
        ></ArtifactChips>

        <v-divider class="mx-4"></v-divider>
      </div>

      <div v-if="badgesPresent">
        <v-card-title class="py-0">Badges</v-card-title>

        <span v-for="(b, index) in record.artifact.badges">
          <v-img
            :key="`badgeimg${index}`"
            max-height="100"
            max-width="100"
            :src="b.badge.image_url"
          ></v-img>
          <a :href="b.badge.url" target="_blank">
            {{ b.badge.title }}
          </a>
        </span>
        <v-divider class="mx-4"></v-divider>
      </div>

      <div v-if="record.artifact.type == 'code'">
        <div v-if="stars || watchers">
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
        </div>

        <div v-if="record.artifact.importer">
          <v-card-title class="py-0">Importer</v-card-title>

          <v-chip color="primary" cols="12" class="ma-2" label>
            <v-avatar left>
              <v-icon>mdi-file-download-outline</v-icon>
            </v-avatar>
            {{
              `${record.artifact.importer.name} v${record.artifact.importer.version}`
            }}
          </v-chip>
          <v-divider class="mx-4"></v-divider>
        </div>
      </div>

      <div v-if="license">
        <v-card-title class="py-0">License</v-card-title>
        <a :href="record.artifact.license.url">
          <v-chip color="primary" cols="12" class="ma-2" label>
            <v-avatar left>
              <v-icon>mdi-scale-balance</v-icon>
            </v-avatar>

            {{ license }}
          </v-chip>
        </a>
        <v-divider class="mx-4"></v-divider>
      </div>

      <div v-if="record.artifact.files.length">
        <v-card-title class="py-0">Files</v-card-title>

        <v-list-item
          v-for="(v, k) in record.artifact.files"
          :key="`file${k}`"
          dense
        >
          <v-list-group :value="true" no-action sub-group>
            <template v-slot:activator>
              <a @click.stop target="_blank" :href="v.url">{{ v.url }}</a>
              &nbsp; (type: {{ v.filetype }}, size: {{ convertSize(v.size) }})
            </template>
            <v-list-item v-for="(vm, km) in v.members" :key="`mem${km}`" dense>
              <a target="_blank" :href="vm.html_url || vm.download_url">{{
                vm.pathname || vm.name || vm.html_url || vm.download_url
              }}</a>
              &nbsp; (type: {{ vm.filetype }}, size: {{ convertSize(vm.size) }})
            </v-list-item>
          </v-list-group>
        </v-list-item>

        <v-divider class="mx-4"></v-divider>
      </div>

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
        <v-spacer></v-spacer>
        <v-btn
          v-if="isOwner()"
          color="success"
          small
          :to="`/artifact/${record.artifact.id}?edit=true`"
          nuxt
        >
          Edit
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
  components: {
    VueMarkdown: () => import('vue-markdown'),
    ArtifactChips: () => import('@/components/ArtifactChips')
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
    tags() {
      let tags = []
      if (this.record.artifact.tags.length > 0) {
        return this.record.artifact.tags.map(e => e.tag)
      }
      let top = this.record.artifact.meta.find(o => o.name == 'top_keywords')
      if (top) {
        tags = tags.concat(JSON.parse(top.value).map(e => e[0]))
      }
      top = this.record.artifact.meta
        ? this.record.artifact.meta.find(o => o.name == 'top_ngram_keywords')
        : null
      if (top) {
        tags = tags.concat(JSON.parse(top.value).map(e => e[0]))
      }
      // return only unique
      let t = [...new Set(tags)]
      t = t.filter(
        el => !this.record.artifact.tags.map(e => e.tag).includes(el)
      )
      return t
    },
    badgesPresent() {
      return (
        typeof this.record.artifact.badges !== 'undefined' &&
        this.record.artifact.badges.length > 0
      )
    },
    languages() {
      let csv = this.record.artifact.meta.find(o => o.name == 'languages')
      if (csv) {
        return csv.value ? csv.value.split(',') : []
      } else {
        return []
      }
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
      return this.record.artifact.license
        ? this.record.artifact.license.short_name +
            ' (' +
            this.record.artifact.license.long_name +
            ')'
        : ''
    },
    markdown() {
      let readmes = {}
      this.record.artifact.files.map(f => {
        readmes = f.members.find(m => m.name.toUpperCase() == 'README.MD')
      })
      if (typeof readmes !== 'undefined') return readmes.content
      else return this.sanitizedDescription
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
        if (action) {
          // FIXME: backend API
          this.$favoritesEndpoint.post(this.record.artifact.id, {})
        } else {
          this.$favoritesEndpoint.delete(this.record.artifact.id)
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
    },
    isOwner() {
      return this.record.artifact.owner !== 'undefined'
        ? this.record.artifact.owner.id == this.userid
        : false
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
