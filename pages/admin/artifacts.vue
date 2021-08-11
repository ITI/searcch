<template>
  <div>
    <v-layout column justify-left align-top>
      <v-row align="center">
        <v-col cols="1">
          <h3>Filters:</h3>
        </v-col>
        <v-col cols="1">
          <v-subheader>
            Type
          </v-subheader>
        </v-col>
        <v-col cols="2">
          <v-select
            v-model="type_select"
            label="Type"
            :items="type_items"
            single-line
            @change="updateArtifacts()"
          ></v-select>
        </v-col>
        <v-col cols="1">
          <v-subheader>
            Published
          </v-subheader>
        </v-col>
        <v-col cols="1">
          <v-checkbox
            v-model="published"
            @change="updateArtifacts()"
          ></v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="owner_filter"
            hint="Case-insensitive substring of user name or email"
            label="Owner"
            @change="updateArtifacts()"
          ></v-text-field>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="1">
          <h3>Refresh:</h3>
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="updateArtifacts()">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider><br />
    </v-layout>
    <v-card>
      <v-card-title>
        Artifacts
        <v-spacer></v-spacer>
        <!-- <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          dense
        ></v-text-field> -->
      </v-card-title>

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
              <a v-if="item.id" :href="`/artifact/${item.id}`" target="_blank">
                <v-icon v-on="on" small color="blue">mdi-database</v-icon>
              </a>
            </template>
            <span>View</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <a
                v-if="!item.publication"
                :href="`/artifact/${item.id}?edit=true`"
                target="_blank"
              >
                <v-icon v-on="on" small color="green">mdi-database-edit</v-icon>
              </a>
            </template>
            <span>Edit</span>
          </v-tooltip>
        </template>
        <template v-slot:item.ctime="{ item }">
          {{ $moment.utc(item.ctime).fromNow() }}
        </template>
        <template v-slot:item.mtime="{ item }">
          {{ item.mtime ? $moment.utc(item.mtime).fromNow() : '' }}
        </template>
        <template v-slot:item.url="{ item }">
          <a v-if="item.url" :href="`${item.url}`" target="_blank">{{
            ellipsize(item.url, 32)
          }}</a>
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
          <v-chip :color="iconColor(item.type)" class="ma-2" label small>
            <v-avatar left>
              <v-icon>{{ iconImage(item.type) }}</v-icon>
            </v-avatar>
            <div>{{ item.type }}</div>
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                v-if="item.id"
                v-on="on"
                small
                color="error"
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <span>Delete Artifact {{ item.id }} </span>
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
  data() {
    return {
      loadingMessage: 'Loading imports...',
      timeoutID: null,
      type_select: '',
      type_items: [
        '',
        'dataset',
        'executable',
        'methodology',
        'metrics',
        'priorwork',
        'publication',
        'hypothesis',
        'code',
        'domain',
        'supportinginfo'
      ],
      published: false,
      owner_filter: '',
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
        if (this.published) payload['published'] = 1
        if (this.owner_filter) payload['owner'] = this.owner_filter
        this.$store.dispatch('system/fetchArtifacts', payload)
      }
      clearTimeout(this.timeoutID)
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      this.$artifactEndpoint.delete(this.items[this.editedIndex].id)
      this.items.splice(this.editedIndex, 1)
      this.closeDelete()
      this.updateArtifacts()
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedIndex = -1
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
