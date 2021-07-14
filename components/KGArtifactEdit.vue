<template>
  <div v-if="record.artifact">
    <h3>
      <a target="_blank" :href="record.artifact.url">
        Artifact {{ record.artifact.id }}
      </a>
    </h3>
    <v-card class="mx-auto my-2">
      <v-card-title
        ><v-text-field
          label="Title"
          outlined
          v-model="title_local"
        ></v-text-field
      ></v-card-title>
      <v-card-text>
        <div>
          <v-textarea
            auto-grow
            outlined
            label="Description"
            v-model="description_local"
          ></v-textarea>
        </div>
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
        v-for="(c, i) in record.artifact.affiliations"
        :key="c.id"
        cols="12"
        class="ma-2"
        label
      >
        <span v-if="c.affiliation.roles == 'Author'">
          <v-icon left>mdi-account-circle</v-icon>
          {{ c.affiliation.person.name }}
          <v-icon @click="c.splice(i, 1)" right>mdi-close</v-icon>
        </span>
      </v-chip>

      <v-chip
        color="primary"
        v-for="(item, index) in meta.creators"
        :key="`c${index}`"
        cols="12"
        class="ma-2"
        label
      >
        <v-icon left>mdi-account-circle</v-icon>
        <v-text-field
          solo
          dark
          placeholder="Enter Creator Name"
          v-model="meta.creators[index]"
          hide-details
          class="m-0"
          background-color="#00476B"
          >{{ meta.creators[index] }}</v-text-field
        >
        <v-icon @click="meta.creators.splice(i, 1)" right>mdi-close</v-icon>
      </v-chip>
      <v-btn @click="meta.creators.push('')" class="success ml-2 mb-2" fab small
        ><v-icon>mdi-plus</v-icon></v-btn
      >

      <v-divider class="mx-4"></v-divider>

      <span v-if="tags">
        <v-card-title class="py-0">Keywords</v-card-title>

        <v-chip
          color="primary"
          v-for="t in tags"
          :key="t"
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
      </span>

      <v-chip
        color="primary"
        v-for="(item, index) in meta.keywords"
        :key="`k${index}`"
        cols="12"
        class="ma-2"
        label
      >
        <v-icon left>mdi-tag-outline</v-icon>
        <v-text-field
          solo
          dark
          placeholder="Enter Keyword"
          v-model="meta.keywords[index]"
          hide-details
          class="m-0"
          background-color="#00476B"
          >{{ meta.keywords[index] }}</v-text-field
        >
        <v-icon @click="meta.keywords.splice(index, 1)" right>mdi-close</v-icon>
      </v-chip>
      <v-btn @click="meta.keywords.push('')" class="success ml-2 mb-2" fab small
        ><v-icon>mdi-plus</v-icon></v-btn
      >

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Related</v-card-title>
      <span v-if="record.artifact.relationships.length">
        <v-chip
          color="primary"
          v-for="(v, k) in record.artifact.relationships"
          :key="`rel${k}`"
          cols="12"
          class="ma-2"
          label
          :to="{ path: `/artifact/${v.related_artifact_id}` }"
        >
          <v-icon left>mdi-relation-one-to-one</v-icon>

          {{ v.relation | titlecase }}: {{ v.related_artifact }}
        </v-chip>
      </span>
      <v-btn class="success ml-2 mb-2" fab small
        ><v-icon>mdi-plus</v-icon></v-btn
      >

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Badges</v-card-title>
      <span v-if="badges">
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
          <v-icon left>mdi-check-decagram</v-icon>
          {{ v.title }}
        </v-chip>
      </span>
      <v-btn class="success ml-2 mb-2" fab small
        ><v-icon>mdi-plus</v-icon></v-btn
      >

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="py-0">Files</v-card-title>
      <span v-if="record.artifact.files.length">
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
      <span class="ml-4 mb-2" v-else>Importer found no files</span>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="green" dark @click="save()">
          Save
        </v-btn>

        <v-btn small color="blue" dark @click="publish()">
          Publish
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar">
      Title and description saved
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
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
      publish_local: false,
      title_local: this.title,
      description_local: this.description,
      snackbar: false,
      loadingMessage: 'Loading...',
      artifact_local: {},
      meta: {
        creators: [],
        keywords: []
      }
    }
  },
  mounted() {
    // force title and description to refresh on page load
    if (this.title && this.description) return true
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
    published() {
      if (this.record.artifact.publication) return true
      return false
    },
    title() {
      this.title_local = this.record.artifact.title
      return this.record.artifact.title
    },
    description() {
      this.description_local = this.record.artifact.description
      return this.record.artifact.description
    }
  },
  methods: {
    async publish() {
      let response = await this.$artifactRecordRepository.put(
        this.record.artifact.id,
        {
          publication: {}
        }
      )
      this.$router.push(`${this.record.artifact.id}`)
    },
    async save() {
      let zip = [['tag']]
      this.meta.creators.map(e => zip.push([e]))
      console.log(this.meta.creators)
      const mapWith = keys => values =>
          Object.fromEntries(keys.map((k, i) => [k, values[i]])),
        getArray = ([keys, ...zip]) => zip.map(mapWith(keys)),
        array = getArray(zip)

      let data = JSON.parse(JSON.stringify(this.record.artifact))
      data['title'] = this.title_local
      data['description'] = this.description_local
      data['tags'] = array
      console.log(data)
      return
      let response = await this.$artifactRecordRepository.put(
        this.record.artifact.id,
        {
          title: this.title_local,
          description: this.description_local
        }
      )
      this.snackbar = true
      this.$store.dispatch('artifacts/fetchArtifact', {
        id: this.record.artifact.id,
        source: 'kg'
      })
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
