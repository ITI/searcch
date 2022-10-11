<template>
  <div v-if="record.artifact">
    <v-card class="mx-auto my-2">
      <v-card-title> {{ record.artifact.title }} </v-card-title>
      <v-card-subtitle>
        Artifact ID:
        {{ record.artifact.id }}
      </v-card-subtitle>
      <v-card-text>
        <a target="_blank" :href="record.artifact.url" rel="noopener">
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

      <div v-if="markdown">
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
          <vue-simple-markdown :source="markdown"></vue-simple-markdown>
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
        <v-card-title class="py-0">Authors</v-card-title>
        <ArtifactChips
          :field="record.artifact.affiliations"
          type="role"
          display
          link
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
          typeof record.artifact.relationships !== 'undefined' &&
            record.artifact.relationships.length
        "
      >
        <v-card-title class="py-0">Relations</v-card-title>

        <v-tabs vertical>
          <v-tab 
            v-for="relationName in Object.keys(relationsMap)"
            :key="`${relationName}-tab`"
          >
            {{ relationName }}
          </v-tab>
          <v-tab-item
            v-for="relationName in Object.keys(relationsMap)"
            :key="`${relationName}-content`"
          >
            <v-list-item 
              v-for="relatedItem in relationsMap[relationName]"
              :key="`${relatedItem.artifact_id}-${relationname}-${relatedItem.related_artifact_id}`"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ relatedItem.related_artifact_group.publication.artifact.title }}
                  <v-btn class="mb-1" fab x-small text :href="getSearcchLinkForArtifact(relatedItem.related_artifact_group.publication.artifact.id)">
                    <v-icon small>mdi-open-in-new</v-icon>
                  </v-btn>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ relatedItem.related_artifact_group.publication.artifact.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-tab-item>
        </v-tabs>

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
              <a @click.stop target="_blank" :href="v.url" rel="noopener">{{
                v.url
              }}</a>
              &nbsp; (type: {{ v.filetype }}, size: {{ convertSize(v.size) }})
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
          v-if="isOwner() && !published"
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
    console.log(this.record.artifact.relationships)
    console.log(this.record.artifact.reverse_relationships)
  },
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      favorites: state => state.artifacts.favoritesIDs,
      user_is_admin: state => state.user.user_is_admin
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
    },
    published() {
      return this.record.artifact.publication ? true : false
    },
    claimText() {
      if (!this.record.artifact.affiliations.length) return 'Claim Ownership'
      else return 'Claim Role'
    },
    relationsMap() {
      const hasReverseRelation = typeof this.record.artifact.artifact_group.reverse_relationships !== 'undefined'
        && this.record.artifact.artifact_group.reverse_relationships.length
      const hasRelation = typeof this.record.artifact.artifact_group.relationships !== 'undefined'
        && this.record.artifact.artifact_group.relationships.length
        
      if (!hasRelation && !hasReverseRelation) {
        return undefined
      }

      let dict = {}
      if (hasRelation) {
        this.record.artifact.artifact_group.relationships.forEach((relationItem) => {
          if (typeof dict[relationItem.relation] === 'undefined') {
            dict[relationItem.relation] = [relationItem]
          } else {
            dict[relationItem.relation].push(relationItem)
          }
        })
      }

      if (hasReverseRelation) {
        this.record.artifact.artifact_group.reverse_relationships.forEach((relationItem) => {
          if (typeof dict[relationItem.relation] === 'undefined') {
            dict[relationItem.relation] = [relationItem]
          } else {
            dict[relationItem.relation].push(relationItem)
          }
        })
      }
      
      return dict
    },
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
          await this.$favoritesEndpoint.post(this.record.artifact.id, {})
        } else {
          await this.$favoritesEndpoint.delete(this.record.artifact.id)
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
      if (this.user_is_admin) return true
      return typeof this.record.artifact.owner !== 'undefined'
        ? this.record.artifact.owner.id == this.userid
        : false
    },
    getSearcchLinkForArtifact(id) {
      return "/artifact/" + id
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
    },
    async claimThis() {
      if (!this.$auth.loggedIn) {
        this.ownershipMessage='Kindly login to claim role'
        this.showOwnershipMessage = true;
      } else {
        await this.$store.dispatch('artifacts/fetchArtifactClaim', {
          artifact_group_id: this.record.artifact.artifact_group_id,
        })
        if(this.artifactClaim.artifact_owner_request && this.artifactClaim.artifact_owner_request.error) {
          this.ownershipMessage=this.artifactClaim.artifact_owner_request.message;
          this.showOwnershipMessage = true;
        } else {
          this.showModal(this.artifactClaim.artifact_owner_request);
        }
      }
    },
    showModal(data) {
      this.isModalVisible = true;
      this.justificationMessage = "";
      if(data) {
        this.isModalDisabled = true;
        this.justificationMessage = data.message;
      }
    },
    closeModal(message) {
      if(message) {
        this.ownershipMessage=message;
        this.showOwnershipMessage = true;
      }
      this.isModalVisible = false;
    },
    hideOwnershipInfo() {
      setTimeout(()=>{this.showOwnershipMessage=false}, 5000);
    }
  },
}
</script>

<style scoped>
.hideoverflow {
  max-height: 700px;
  overflow: hidden;
}
</style>
