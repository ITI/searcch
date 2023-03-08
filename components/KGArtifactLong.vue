<template>
  <div v-if="record.artifact">
    <v-card class="mx-auto my-2">
      <v-card-title>{{ record.artifact.title }}</v-card-title>
      <v-card-subtitle>
        <div
          v-if="record.artifact.artifact_group.publication != null &&
                record.artifact.artifact_group.publication.artifact_id != record.artifact.id"
          align="left"
          class="mx-0"
        >
          &nbsp;&nbsp;(<a :href="`/artifact/${record.artifact.artifact_group_id}`">newest version</a>)
        </div>
        <div>
        </div>
      </v-card-subtitle>

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

        <v-row align="center" class="mx-0">
          <span v-if="record.artifact.publication">
            Published: {{ $moment(record.artifact.publication.time) }}
            &nbsp;(record version
            <a
              :href="`/artifact/${record.artifact.artifact_group_id}/${record.artifact.id}`"
              rel="noopener"
              >
              {{ record.artifact.publication.version }}</a>)
          </span>
          <span v-else>
            Draft: {{ $moment(record.artifact.mtime || record.artifact.ctime) }}
            &nbsp;(version
            <a
              :href="`/artifact/${record.artifact.artifact_group_id}/${record.artifact.id}`"
              rel="noopener"
              >
              {{ record.artifact.artifact_group_id + "/" + record.artifact.id }}</a>)
          </span>
        </v-row>
        <v-row
          v-if="record.artifact.artifact_group.publications.length"
          align="center"
          class="mx-0"
        >
          <v-btn
            v-if="record.artifact.artifact_group.publications"
            x-small
            @click="history_expanded = !history_expanded"
          >
            {{ !history_expanded ? 'Show Record History' : 'Hide Record History' }}
          </v-btn>
        </v-row>
      </v-card-text>

      <v-card-text v-if="history_expanded">
        <v-container
          align="center" class="mx-0"
          v-for="publication in record.artifact.artifact_group.publications.slice().reverse()"
          :key="publication.id"
        >
          <v-row align="center" class="mx-0">
            <v-container>
              <v-row>
                <v-icon
                  v-if="publication.artifact.id === record.artifact.id"
                >
                  mdi-arrow-right-thin
                </v-icon>
                Record Version: &nbsp;
                <a
                  :href="`/artifact/${publication.artifact.artifact_group_id}/${publication.artifact.id}`"
                  rel="noopener"
                >
                  {{ publication.version }}
                </a>
                &nbsp;
                <span v-if="publication.artifact.id !== record.artifact.id">
                  (compare:&nbsp;
                  <a
                    rel="noopener"
                    @click="getDiff(publication.artifact.id,record.artifact.id)"
                  >from</a>,
                  <a
                    rel="noopener"
                    @click="getDiff(record.artifact.id,publication.artifact.id)"
                  >
                    to</a>)
                </span>
              </v-row>
              <v-row align="center" class="mx-0">
                Published: {{ $moment(publication.time) }}
              </v-row>
              <v-row align="center" class="mx-0">
                Publisher: &nbsp; <a :href="`/profile/${publication.publisher.id}`" rel="noopener">{{ publication.publisher.person.name }}</a>
              </v-row>
              <v-row
                align="center"
                class="mx-0"
                v-if="publication.notes && publication.notes != ''">
                Notes: {{ publication.notes }}
              </v-row>
            </v-container>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>


      <div v-if="markdown" :class="hideOverflow">
        <v-divider class="mx-4"></v-divider>
        <v-card-title>
          <v-row class="mx-1">
            Readme
            <v-spacer></v-spacer>
            <v-btn :v-if="false && isOverflow" @click="expanded = !expanded">
              {{ overflowText }}
              <v-icon>{{ overflowIcon }}</v-icon>
            </v-btn>
          </v-row>
        </v-card-title>
        <v-card-text>
          <vue-simple-markdown :source="markdown"></vue-simple-markdown>
        </v-card-text>
      </div>
      <div>
        <v-card-text>
          <v-row class="mx-1">
            <v-btn
              elevation="0"
              tile
              :v-if="isOverflow"
              @click="expanded = !expanded"
              block
              >
              {{ overflowText }}
              <v-icon>{{ overflowIcon }}</v-icon>
            </v-btn>
          </v-row>
        </v-card-text>
      </div>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0"> Artifact Types </v-card-title>

      <v-chip :color="iconColor(record.artifact.type)" class="ma-2" label>
        <v-avatar left>
          <v-icon>{{ iconImage(record.artifact.type) }}</v-icon>
        </v-avatar>

        <div>{{ record.artifact.type | titlecase }}</div>
      </v-chip>


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

      <div v-if="labels.length">
        <v-card-title class="py-0">Labels</v-card-title>
        <ArtifactChips
          :field="labels"
          type="label"
          display
          link
        ></ArtifactChips>

        <v-divider class="mx-4"></v-divider>
      </div>

      <div v-if="languages.length > 0">
        <v-card-title class="py-0">Programming Languages</v-card-title>
        <ArtifactChips
          :field="languages"
          type="software"
          display
        ></ArtifactChips>

        <v-divider class="mx-4"></v-divider>
      </div>

      <div
        v-if="
          typeof record.artifact.artifact_group.relationships !== 'undefined' &&
            record.artifact.artifact_group.relationships.length
        "
      >
        <v-card-title class="py-0">Relations</v-card-title>

        <ArtifactChips
          :field="record.artifact.artifact_group.relationships"
          type="relation"
          display
          link
        ></ArtifactChips>

        <v-divider class="mx-4"></v-divider>
      </div>

      <div
        v-if="
          typeof record.artifact.artifact_group.reverse_relationships !== 'undefined' &&
            record.artifact.artifact_group.reverse_relationships.length
        "
      >
        <v-card-title class="py-0">Reverse Relations</v-card-title>

        <ArtifactChips
          :field="record.artifact.artifact_group.reverse_relationships"
          type="reverse-relation"
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
          <a :href="b.badge.url" target="_blank" rel="noopener">
            {{ b.badge.title }}
          </a>
        </span>
        <v-divider class="mx-4"></v-divider>
      </div>

      <div v-if="record.artifact.type == 'software'">
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


      <v-divider class="mx-4"></v-divider>
      <v-card-title class="py-0"> Collection </v-card-title>

      <v-chip :color="iconColor(record.artifact.type)" class="ma-2" label>
        <v-avatar left>
          <v-icon>{{ iconImage(record.artifact.collection) }}</v-icon>
        </v-avatar>

        <div>{{ record.artifact.collection | titlecase }}</div>
      </v-chip>


      <v-divider class="mx-4"></v-divider>
      <v-card-title class="py-0"> Start/end </v-card-title>

      <v-chip :color="iconColor(record.artifact.fromtime)" class="ma-2" label>
        <v-avatar left>
          <v-icon>{{ iconImage(record.artifact.fromtime) }}</v-icon>
        </v-avatar>

        <div>
    	{{ new Date(record.artifact.fromtime + 'Z').toUTCString() }}
	</div>
      </v-chip>

      <v-chip :color="iconColor(record.artifact.totime)" class="ma-2" label>
        <v-avatar left>
          <v-icon>{{iconImage(record.artifact.totime) }}</v-icon>
        </v-avatar>

        <div>{{ new Date(record.artifact.totime + 'Z').toUTCString() }}</div>
      </v-chip>

      <v-divider class="mx-4"></v-divider>

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
              type: {{ v.filetype }}, size: {{ convertSize(v.size) }}
            </template>
            <v-list-item v-for="(vm, km) in v.members" :key="`mem${km}`" dense>
              <a
                target="_blank"
                :href="vm.html_url || vm.download_url"
                rel="noopener"
                >{{
                  vm.pathname || vm.name || vm.html_url || vm.download_url
                }}</a
              >
              &nbsp; (type: {{ vm.filetype }}, size: {{ convertSize(vm.size) }})
            </v-list-item>
          </v-list-group>
        </v-list-item>

        <v-divider class="mx-4"></v-divider>
      </div>

      <v-card-title>Description</v-card-title>

      <v-card-text>
        <div v-html="sanitizedDescription"></div>
      </v-card-text>


      <v-card-actions>
        <v-btn
          icon
          @click="favoriteThis()"
          :color="favorite == true ? 'red' : ''"
        >
          <v-icon>{{ favorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>

        <v-btn icon :to="`/artifact/review/${record.artifact.artifact_group_id}`" nuxt>
          <v-icon>mdi-comment</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <span v-if="(isOwner() || isAdmin()) && !published">
          <v-btn
            color="success"
            small
            :to="`/artifact/${record.artifact.artifact_group_id}/${record.artifact.id}?edit=true`"
            nuxt
            >
            Edit
          </v-btn>
        </span>
        <span v-if="(isOwner() || isAdmin()) && published">
          <v-btn
            color="success"
            small
            @click="newVersion()"
            nuxt
            >
            Edit New Version
          </v-btn>
          <v-btn
            color="success"
            small
            @click="reImportNewVersion()"
            nuxt
            >
            Reimport New Version
          </v-btn>
        </span>
        <v-btn
          v-if="!(isOwner() || isAdmin())"
          color="primary"
          :to="`/artifact/request/${record.artifact.artifact_group_id}`"
          nuxt
        >
          Request
        </v-btn>
      </v-card-actions>

    </v-card>

    <template>
      <v-dialog v-model="diff_results_dialog" scrollable>
        <v-card>
          <v-card-title>
            <span class="text-h5">Comparison Results</span>
            <v-spacer/>
            <span class="text-h7">
              (from
              {{ this.record.artifact.artifact_group_id + "/" + this.diff_from }}
              to
              {{ this.record.artifact.artifact_group_id + "/" + this.diff_to }}
              )
            </span>
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="diff_results_tab">
              <v-tab>Visual</v-tab>
              <v-tab>Raw</v-tab>
            </v-tabs>

            <v-tabs-items v-model="diff_results_tab">
              <v-tab-item :key="visual">
                <ArtifactCurationList
                  :curations="diff_results">
                </ArtifactCurationList>
              </v-tab-item>
              <v-tab-item :key="raw">
                <JsonPrettyPrint :value="diff_results"></JsonPrettyPrint>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="diff_results_dialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </div>
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
    ArtifactChips: () => import('@/components/ArtifactChips'),
    ArtifactCurationList: () => import('@/components/ArtifactCurationList'),
    JsonPrettyPrint: () => import('@/components/pretty-print')
  },
  data() {
    return {
      loading: true,
      loaded: false,
      expanded: false,
      history_expanded: false,
      diff_from: -1,
      diff_to: -1,
      diff_results: [],
      diff_results_dialog: false,
      diff_results_tab: "visual",
      loadingMessage: 'Loading...',

    }
  },
  mounted() {
    setTimeout(() => {
      this.loadingMessage = 'Error loading'
    }, 5000)
    console.log(this.labels)
  },
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      favorites: state => state.artifacts.favoritesIDs,
      user_is_admin: state => state.user.user_is_admin
    }),
    sanitizedDescription: function() {
      return this.$sanitize(this.record.artifact.description.replace(/\<\\pre\>/, ''))

    },
    favorite: {
      get() {
        return this.favorites[this.record.artifact.artifact_group_id] ? true : false
      },
      set(value) {
        if (value)
          this.$store.commit('artifacts/ADD_FAVORITE', this.record.artifact.artifact_group_id)
        else
          this.$store.commit(
            'artifacts/REMOVE_FAVORITE',
            this.record.artifact.artifact_group_id
          )
      }
    },
    labels() {
      if(this.record.artifact.labels.length > 0){
        return this.record.artifact.labels
      }

    },
    tags() {
      console.log(this.record.artifact)
      let tags = []
      if (this.record.artifact.tags.length > 0) {
        console.log(this.record.artifact.tags.map(e => e.tag))
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
      console.log(readmes)
      if (typeof readmes !== 'undefined' && readmes.file_content)
         return atob(readmes.file_content.content)
    },
    hideOverflow() {
      return {
        hideoverflow: !this.expanded
      }
    },
    isOverflow() {
      if (!this.loaded) return false
      let element = this.$refs['markdown']
      return element.offsetHeight >= 250
    },
    overflowIcon() {
      if (!this.expanded) return 'mdi-chevron-down'
      else return 'mdi-chevron-up'
    },
    overflowText() {
      if (!this.expanded) return 'Show All'
      else return 'Collapse'
    },
    published() {
      return this.record.artifact.publication ? true : false
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
          await this.$favoritesEndpoint.post(this.record.artifact.artifact_group_id, {})
        } else {
          await this.$favoritesEndpoint.delete(this.record.artifact.artifact_group_id)
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
    isAdmin() {
      return this.user_is_admin
    },
    isOwner() {
      if (this.user_is_admin) return true
      return typeof this.record.artifact.owner !== 'undefined'
        ? this.record.artifact.owner.id == this.userid
        : false
    },
    async newVersion() {
      let response = await this.$artifactEndpoint.post(
        [this.record.artifact.artifact_group_id, this.record.artifact.id],{})
      this.$store.dispatch('artifacts/fetchArtifact', {
        artifact_group_id: response.artifact.artifact_group_id,
        id: response.artifact.id
      })
      this.$router.push("/artifact/" + response.artifact.artifact_group_id
        + "/" + response.artifact.id + "?edit=true")
    },
    async reImportNewVersion() {
      let response = await this.$artifactEndpoint.post(
        [this.record.artifact.artifact_group_id, this.record.artifact.id],
        { reimport: true })
      this.$router.push("/import")
    },
    async getDiff(from, to) {
      this.diff_from = from
      this.diff_to = to
      let response = await this.$artifactCompareEndpoint.show(
        [this.record.artifact.artifact_group_id, from],
        { target_artifact_id: to}
      )
      this.diff_results = response.curations.map(
        function(x) { return { curation: x }; }
      )
      console.log(this.diff_results)
      for (var i = 0; i < this.diff_results.length; ++i) {
        // NB: opdata from server is a string, not JSON itself.
        this.diff_results[i].curation.opdata =
          JSON.parse(this.diff_results[i].curation.opdata)

        // NB: curations might not have IDs, as in this case,
        // where the server generated a diff.  So we have to
        // cons up an id for the ArtifactCurationList component.
        this.diff_results[i]._id = i
      }
      this.diff_results_dialog = true
    }
  }
}
</script>

<style scoped>
.hideoverflow {
  max-height: 250px;
  overflow: hidden;
}
</style>
