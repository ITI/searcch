<template>
  <div>
    <v-layout column justify-left align-top>
      <v-row align="center">
        <v-btn icon @click="updateArtifacts()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-col cols="1">
          <h3>Filters:</h3>
        </v-col>
        <v-col cols="2">
          <v-select
            clearable
            v-model="type_select"
            label="Type"
            :items="type_items"
            @change="updateArtifacts()"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-select
            clearable
            v-model="publication_select"
            label="Publication Status"
            :items="publication_items"
            @change="updateArtifacts()"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            v-model="allversions"
            label="All Versions"
            @change="updateArtifacts()"
          ></v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-text-field
            clearable
            v-model="owner_filter"
            hint="Case-insensitive substring of user name or email"
            label="Owner"
            @change="updateArtifacts()"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            clearable
            v-model="artifact_group_id"
            hint="Integer artifact group ID"
            label="Artifact Group ID"
            @change="updateArtifacts()"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider><br />
    </v-layout>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :loading="loading"
        :options.sync="options"
        :footer-props="{ 'items-per-page-options': [10, 20, 50, 100, -1] }"
        :server-items-length="total"
        :expanded.sync="expanded"
        dense
      >
        <template v-slot:top>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-sheet
              class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block"
              color="blue-grey darken-3"
              dark
            >
              <div class="grey--text text--lighten-1 text-body-2 mb-4">
                Are you sure you want to delete this item?
              </div>

              <v-btn plain color="success" @click="deleteItemConfirm">OK</v-btn>
              <v-btn plain color="error" @click="closeDelete">Cancel</v-btn>
            </v-sheet>
          </v-dialog>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <p>Created: {{ $moment.utc(item.ctime).fromNow() }}</p>
            <p>
              Modified:
              {{ item.mtime ? $moment.utc(item.mtime).fromNow() : '' }}
            </p>
          </td>
        </template>
        <template v-slot:item.id="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <a
                v-if="item.id"
                :href="`/artifact/${item.artifact_group_id}/${item.id}`"
                target="_blank"
                rel="noopener"
              >
                <v-icon v-on="on" small color="info">mdi-database</v-icon>
              </a>
            </template>
            <span>View</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <a
                v-if="item.id && !item.publication"
                :href="`/artifact/${item.artifact_group_id}/${item.id}?edit=true`"
                target="_blank"
                rel="noopener"
              >
                <v-icon v-on="on" small color="green">mdi-database-edit</v-icon>
              </a>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <a v-bind:item="item" @click="setArtifactGroupIdFilter(item.artifact_group_id)">{{ item.artifact_group_id }}</a>/{{ item.id }}
        </template>
        <template v-slot:item.ctime="{ item }">
          {{ $moment.utc(item.ctime).fromNow() }}
        </template>
        <template v-slot:item.mtime="{ item }">
          {{ item.mtime ? $moment.utc(item.mtime).fromNow() : '' }}
        </template>
        <template v-slot:item.url="{ item }">
          <a
            v-if="item.url"
            :href="`${item.url}`"
            target="_blank"
            rel="noopener"
            >{{ ellipsize(item.url, 32) }}</a
          >
        </template>
        <template v-slot:item.publication="{ item }">
          <v-icon v-if="item.publication">mdi-check</v-icon>
        </template>
        <template v-slot:item.owner.person="{ item }">
          {{ item.owner.person.email
          }}{{
            item.owner.person.name ? ' (' + item.owner.person.name + ')' : ''
          }}
        </template>
        <template v-slot:item.type="{ item }">
          <ArtifactChips
            :field="[item.type]"
            :type="item.type"
            small
          ></ArtifactChips>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                v-if="item.id"
                v-on="on"
                small
                color="error"
                @click="deleteItem(item, false)"
              >
                mdi-delete
              </v-icon>
            </template>
            <span>Delete Artifact Version {{ item.id }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                v-if="item.id"
                v-on="on"
                small
                color="error"
                @click="deleteItem(item, true)"
              >
                mdi-delete-alert
              </v-icon>
            </template>
            <span>Delete Artifact Group {{ item.artifact_group_id }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { artifactIcon, artifactColor } from '@/helpers'

export default {
  components: {
    ArtifactChips: () => import('@/components/ArtifactChips')
  },
  data() {
    return {
      loadingMessage: 'Loading imports...',
      timeoutID: null,
      type_select: '',
      type_items: [
        '',
        'dataset',
        'presentation',
        'publication',
        'software',
        'other'
      ],
      publication_select: 'published',
      publication_items: [
        '',
        'published',
        'draft'
      ],
      allversions: false,
      owner_filter: '',
      artifact_group_id: null,
      headers: [
        { text: 'Artifact', value: 'id', align: 'start', sortable: true },
        { text: 'Type', value: 'type', sortable: true },
        { text: 'Title', value: 'title', sortable: true },
        { text: 'URL', value: 'url', sortable: true },
        { text: 'Published', value: 'publication', sortable: true },
        {
          text: 'Created',
          sortable: true,
          value: 'ctime'
        },
        {
          text: 'Modified',
          sortable: true,
          value: 'mtime'
        },
        { text: 'Owner', value: 'owner.person', sortable: false },
        { text: 'Views', value: 'view_count', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }

        // { text: '', value: 'data-table-expand' }
        //{ text: "Owner Email", value: "owner.person.email", sortable: false },
      ],
      loading: true,
      options: {
        itemsPerPage: 20,
        page: 1,
        sortDesc: [true]
      },
      expanded: [],
      search: '',
      dialogDelete: false,
      editedIndex: -1,
      deleteAllVersions: false,
      items: []
    }
  },
  async mounted() {
    this.$store.dispatch('user/fetchUser')
    this.loadingMessage = 'Loading artifacts...'
    this.updateArtifacts()
    this.timeoutID = setTimeout(() => {
      this.loadingMessage = 'No artifacts found'
    }, 5000)
  },
  computed: {
    ...mapState({
      user_is_admin: state => state.user.user_is_admin,
      artifacts: state => state.system.artifacts.artifacts,
      page: state => state.system.artifacts.page,
      pages: state => state.system.artifacts.pages,
      total: state => state.system.artifacts.total
    })
  },
  methods: {
    ellipsize(s, l) {
      if (s.length > l) return s.substring(0, l) + '...'
      else return s
    },
    updateArtifacts() {
      if (this.user_is_admin) {
        this.loading = true
        var payload = {
          page: this.options.page,
          items_per_page: this.options.itemsPerPage,
          sort: this.options.sortBy,
          sort_desc: this.options.sortDesc[0] === true ? 1 : 0,
          allusers: 1,
          short_view_include: 'owner,publication'
        }
        if (this.type_select) payload['type'] = this.type_select
        if (this.publication_select) {
          if (this.publication_select === "published") payload['published'] = 1
          if (this.publication_select === "draft") payload['published'] = 0
        }
        if (this.allversions) payload['allversions'] = 1
        if (this.owner_filter) payload['owner'] = this.owner_filter
        if (this.artifact_group_id) payload['artifact_group_id'] = this.artifact_group_id
        this.$store.dispatch('system/fetchArtifacts', payload)
      }
      clearTimeout(this.timeoutID)
    },
    setArtifactGroupIdFilter(id) {
      this.artifact_group_id = id
      this.updateArtifacts()
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    deleteItem(item, allversions) {
      this.editedIndex = this.items.indexOf(item)
      this.dialogDelete = true
      this.deleteAllVersions = true
    },
    async deleteItemConfirm() {
      if (this.deleteAllVersions) {
        await this.$artifactEndpoint.delete(
          this.items[this.editedIndex].artifact_group_id)
      }
      else {
        await this.$artifactEndpoint.delete(
          [ this.items[this.editedIndex].artifact_group_id,
            this.items[this.editedIndex].id ])
      }
      this.items.splice(this.editedIndex, 1)
      this.closeDelete()
      this.updateArtifacts()
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedIndex = -1
        this.deleteAllVersions = true
      })
    }
  },
  watch: {
    user_is_admin() {
      // had to make this because on refresh, user_is_admin doesn't update until after the mounted has already run,
      // but mounted needs to run when switching pages where the user_is_admin doesn't update
      this.updateArtifacts()
    },
    artifacts() {
      this.loading = false
      this.items = JSON.parse(JSON.stringify(this.artifacts))
    },
    options: {
      handler() {
        this.updateArtifacts()
      },
      deep: true
    }
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.timeoutID)
    next()
  }
}
</script>
