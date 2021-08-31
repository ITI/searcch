<template>
  <div>
    <v-layout column justify-left align-top>
      <v-row align="center">
        <v-col cols="1">
          <h3>Filters:</h3>
        </v-col>
        <v-col cols="1">
          <v-subheader>
            Can Admin
          </v-subheader>
        </v-col>
        <v-col cols="1">
          <v-checkbox v-model="can_admin" @change="updateUsers()"></v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="owner_filter"
            hint="Case-insensitive substring of user name or email"
            label="User"
            @change="updateUsers()"
          ></v-text-field>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="1">
          <h3>Refresh:</h3>
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="updateUsers()">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider><br />
    </v-layout>
    <v-card>
      <v-card-title>
        Users
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
        dense
      >
        <template v-slot:item.id="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <a
                v-if="item.id"
                :href="`/profile/${item.id}`"
                nuxt
                target="_blank"
                rel="noopener"
              >
                <v-icon v-on="on">mdi-account</v-icon>
              </a>
              {{ item.id }}
            </template>
            <span>View User Profile</span>
          </v-tooltip>
        </template>
        <template v-slot:item.can_admin="{ item }">
          <v-icon v-if="item.can_admin">mdi-check</v-icon>
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
      loadingMessage: 'Loading users...',
      timeoutID: null,
      can_admin: false,
      owner_filter: '',
      headers: [
        { text: 'User ID', value: 'id', align: 'start', sortable: true },
        { text: 'User Email', value: 'person.email' },
        { text: 'User Name', value: 'person.name' },
        { text: 'Can Admin', value: 'can_admin' }
      ],
      loading: true,
      options: {
        itemsPerPage: 20,
        page: 1,
        sortDesc: [true]
      },
      search: ''
    }
  },
  async mounted() {
    this.$store.dispatch('user/fetchUser')
    this.loadingMessage = 'Loading users...'
    this.updateUsers()
    this.timeoutID = setTimeout(() => {
      this.loadingMessage = 'No users found'
    }, 5000)
  },
  computed: {
    ...mapState({
      user_is_admin: state => state.user.user_is_admin,
      items: state => state.system.users.users,
      page: state => state.system.users.page,
      pages: state => state.system.users.pages,
      total: state => state.system.users.total
    })
  },
  methods: {
    updateUsers() {
      if (this.user_is_admin) {
        this.loading = true
        var payload = {
          page: this.options.page,
          items_per_page: this.options.itemsPerPage,
          sort: this.options.sortBy,
          sort_desc: this.options.sortDesc[0] === true ? 1 : 0,
          allusers: 1
        }
        if (this.can_admin) payload['can_admin'] = 1
        if (this.owner_filter) payload['owner'] = this.owner_filter
        this.$store.dispatch('system/fetchUsers', payload)
      }
      clearTimeout(this.timeoutID)
    }
  },
  watch: {
    user_is_admin() {
      // had to make this because on refresh, user_is_admin doesn't update until after the mounted has already run,
      // but mounted needs to run when switching pages where the user_is_admin doesn't update
      console.log('watch updateUsers')
      this.updateUsers()
    },
    items() {
      this.loading = false
    },
    options: {
      handler() {
        this.updateUsers()
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
