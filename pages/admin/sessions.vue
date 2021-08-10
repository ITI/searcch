<template>
  <div>
    <v-layout column justify-left align-top>
      <v-row align="center">
        <v-col cols="1">
          <h3>Filters:</h3>
        </v-col>
        <v-col cols="1">
          <v-subheader>
            Is Admin
          </v-subheader>
        </v-col>
        <v-col cols="1">
          <v-checkbox
            v-model="is_admin"
            @change="updateSessions()"
          ></v-checkbox>
        </v-col>
        <v-col cols="1">
          <v-subheader>
            Can Admin
          </v-subheader>
        </v-col>
        <v-col cols="1">
          <v-checkbox
            v-model="can_admin"
            @change="updateSessions()"
          ></v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="owner_filter"
            hint="Case-insensitive substring of user name or email"
            label="User"
            @change="updateSessions()"
          ></v-text-field>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="1">
          <h3>Refresh:</h3>
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="updateSessions()">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider><br />
    </v-layout>
    <v-card>
      <v-card-title>
        Login Sessions
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
        :custom-filter="specializedFilter"
        :loading="loading"
        :options.sync="options"
        :footer-props="{ 'items-per-page-options': [10, 20, 50, 100, -1] }"
        :server-items-length="total"
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
            <span>Delete Session {{ item.id }} </span>
          </v-tooltip>
        </template>
        <template v-slot:item.user.id="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <a v-if="item.user_id" :href="`/profile/${item.user_id}`">
                <v-icon v-on="on">mdi-account</v-icon>
              </a>
            </template>
            <span>View User Profile</span>
          </v-tooltip>
        </template>
        <template v-slot:item.expires_on="{ item }">
          {{ $moment.utc(item.expires_on).fromNow() }}
        </template>
        <template v-slot:item.is_admin="{ item }">
          <v-icon v-if="item.is_admin">mdi-check</v-icon>
        </template>
        <template v-slot:item.user.can_admin="{ item }">
          <v-icon v-if="item.user.can_admin">mdi-check</v-icon>
        </template>
        <template v-slot:item.user="{ item }">
          {{ item.user.person.email
          }}{{
            item.user.person.name ? ' (' + item.user.person.name + ')' : ''
          }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loadingMessage: 'Loading imports...',
      timeoutID: null,
      is_admin: false,
      can_admin: false,
      owner_filter: '',
      headers: [
        { text: 'Session ID', value: 'id', align: 'start', sortable: true },
        { text: 'Expires', value: 'expires_on', sortable: true },
        // TODO: disabled as endpoint for viewing specific user profile doesn't exist yet
        // { text: 'User ID', value: 'user.id' },
        { text: 'User', value: 'user' },
        { text: 'Is Admin', value: 'is_admin' },
        { text: 'Can Admin', value: 'user.can_admin' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      loading: true,
      options: {
        itemsPerPage: 20,
        page: 1
      },
      search: '',
      dialogDelete: false,
      editedIndex: -1,
      items: []
    }
  },
  async mounted() {
    this.$store.dispatch('user/fetchUser')
    this.loadingMessage = 'Loading sessions...'
    this.updateSessions()
    this.timeoutID = setTimeout(() => {
      this.loadingMessage = 'No sessions found'
    }, 5000)
  },
  computed: {
    ...mapState({
      user_is_admin: state => state.user.user_is_admin,
      sessions: state => state.system.sessions.sessions,
      page: state => state.system.sessions.page,
      pages: state => state.system.sessions.pages,
      total: state => state.system.sessions.total
    })
  },
  methods: {
    updateSessions() {
      if (this.user_is_admin) {
        this.loading = true
        var payload = {
          page: this.options.page,
          items_per_page: this.options.itemsPerPage,
          sort: this.options.sortBy,
          sort_desc: this.options.sortDesc[0] === true ? 1 : 0,
          allusers: 1
        }
        if (this.is_admin) payload['is_admin'] = 1
        if (this.can_admin) payload['can_admin'] = 1
        if (this.owner_filter) payload['owner'] = this.owner_filter
        this.$store.dispatch('system/fetchSessions', payload)
      }
      clearTimeout(this.timeoutID)
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      this.$sessionEndpoint.delete(this.items[this.editedIndex].id)
      this.items.splice(this.editedIndex, 1)
      this.closeDelete()
      this.updateSessions()
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },
    specializedFilter(value, search, item) {
      if (value != null && search != null) {
        return (
          value != null &&
          search != null &&
          (item.user.person.name
            .toString()
            .toLowerCase()
            .indexOf(search.toLowerCase()) !== -1 ||
            item.user.person.email
              .toString()
              .toLowerCase()
              .indexOf(search.toLowerCase()) !== -1 ||
            value
              .toString()
              .toLowerCase()
              .indexOf(search.toLowerCase()) !== -1 ||
            this.$moment
              .utc(item.expires_on)
              .fromNow()
              .toString()
              .toLowerCase()
              .indexOf(search.toLowerCase()) !== -1)
        )
      }
    }
  },
  watch: {
    user_is_admin() {
      // had to make this because on refresh, user_is_admin doesn't update until after the mounted has already run,
      // but mounted needs to run when switching pages where the user_is_admin doesn't update
      this.updateSessions()
    },
    sessions() {
      this.loading = false
      this.items = JSON.parse(JSON.stringify(this.sessions))
    },
    options: {
      handler() {
        this.updateSessions()
      },
      deep: true
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.timeoutID)
    next()
  }
}
</script>
