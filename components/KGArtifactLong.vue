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

      <v-card-title>
        <v-row class="mx-1"
          >Description<v-spacer></v-spacer
          ><v-btn v-if="isOverflow" @click="expanded = !expanded">{{
            !expanded ? 'Expand' : 'Collapse'
          }}</v-btn></v-row
        >
      </v-card-title>

      <v-card-text ref="descDiv" :class="hideOverflow">
        <vue-markdown
          v-if="record.artifact.type === 'code'"
          :source="markdown"
        ></vue-markdown>
        <div v-else v-html="sanitizedDescription"></div>
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

      <v-card-title class="py-0"> Artifact Type </v-card-title>

      <v-chip :color="iconColor(record.artifact.type)" class="ma-2" label>
        <v-avatar left>
          <v-icon>{{ iconImage(record.artifact.type) }}</v-icon>
        </v-avatar>

        <div>{{ record.artifact.type | titlecase }}</div>
      </v-chip>

      <v-divider class="mx-4"></v-divider>

      <span v-if="record.artifact.affiliations">
        <v-card-title class="py-0">Roles</v-card-title>

        <v-chip
          color="primary"
          v-for="a in record.artifact.affiliations"
          :key="a.id"
          cols="12"
          class="ma-2"
          label
        >
          <span>
            <v-avatar left>
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
            {{ a.affiliation.person.name }} ({{ a.roles }})
          </span>
        </v-chip>
        <v-divider class="mx-4"></v-divider>
      </span>

      <span v-if="tags.length">
        <v-card-title class="py-0">Keywords</v-card-title>
        <v-chip
          color="primary"
          v-for="(t, index) in tags"
          :key="`tag${index}`"
          cols="12"
          class="ma-2"
          label
          :to="{ path: `/search?keywords=${t}` }"
        >
          <v-avatar left>
            <v-icon>mdi-tag-outline</v-icon>
          </v-avatar>
          {{ t }}
        </v-chip>
        <v-divider class="mx-4"></v-divider>
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
            <v-icon>{{ iconImage('code') }}</v-icon>
          </v-avatar>
          {{ v }}
        </v-chip>
        <v-divider class="mx-4"></v-divider>
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

          {{ v.relation | titlecase }}: {{ v.related_artifact_id }}
        </v-chip>
        <v-divider class="mx-4"></v-divider>
      </span>

      <span v-if="badgesPresent">
        <v-card-title class="py-0">Badges</v-card-title>

        <span v-for="(b, index) in record.artifact.badges">
          <v-img
            :key="`badgeimg${index}`"
            max-height="100"
            max-width="100"
            :src="b.badge.image_url"
          />
          <a :href="b.badge.url" target="_blank">
            {{ b.badge.title }}
          </a>
        </span>
        <v-divider class="mx-4"></v-divider>
      </span>

      <div v-if="record.artifact.type == 'code'">
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

        <span v-if="record.artifact.importer">
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
        </span>
      </div>

      <span v-if="license">
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
      </span>

      <span v-if="record.artifact.files.length">
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
  components: {
    VueMarkdown: () => import('vue-markdown')
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
      if (this.record.artifact.tags) {
        tags = this.record.artifact.tags.map(e => e.tag)
      }
      let topics = this.record.artifact.meta.find(o => o.name == 'top_keywords')
      if (topics) {
        tags = tags.concat(JSON.parse(topics.value).map(e => e[0]))
      }
      return tags.filter((value, index, self) => self.indexOf(value) === index)
    },
    badgesPresent() {
      return (
        typeof this.record.artifact.badges !== 'undefined' &&
        this.record.artifact.badges.length > 0
      )
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

<style scoped>
.hideoverflow {
  max-height: 700px;
  overflow: hidden;
}
</style>
