<template>
  <span>
    <v-layout column justify-left align-top>
      <v-row class="ml-1 mb-2">
        <h1>Login Sessions</h1>
      </v-row>
      <v-divider></v-divider><br />
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
            label="Owner"
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
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :options.sync="options"
        :server-items-length="total"
        :footer-props="{'items-per-page-options':[10, 20, 50, 100, -1]}">
        <template #item.user_id="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <a v-if="item.id" :href="`/profile/${item.id}`">
                <v-icon v-on="on">mdi-account</v-icon>
              </a>
            </template>
            <span>View User Profile</span>
          </v-tooltip>
        </template>
        <template v-slot:item.expires_on="{ item }">
          {{ $moment.utc(item.expires_on).fromNow() }}
        </template>
        <template #item.is_admin="{ item }">
          <v-icon v-if="item.is_admin">mdi-check</v-icon>
        </template>
        <template #item.user.can_admin="{ item }">
          <v-icon v-if="item.user.can_admin">mdi-check</v-icon>
        </template>
        <template #item.user="{ item }">
          {{ item.user.person.email }}{{ item.user.person.name ? " (" + item.user.person.name + ")" : "" }}
        </template>
      </v-data-table>
    </div>
    </v-layout>
  </span>
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
      owner_filter: "",
      headers: [
        { text: "Session ID", value: "id", align: "start", sortable: true },
        { text: "Expires", value: "expires_on", sortable: true },
        { text: "User", value: "user" },
        //{ text: "User ID", value: "user.id" },
        { text: "Is Admin", value: "is_admin" },
        { text: "Can Admin", value: "user.can_admin" },
      ],
      loading: true,
      options: {
        itemsPerPage: 10,
        page: 1,
        sortDesc: [true]
      },
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
      items: state => state.system.sessions.sessions,
      //page: state => state.system.sessions.page,
      //pages: state => state.system.sessions.pages,
      total: state => state.system.sessions.total
    }),
  },
  methods: {
    updateSessions() {
      if (this.user_is_admin) {
        this.loading = true
        var payload = {
          page: this.options.page, items_per_page: this.options.itemsPerPage,
          sort: this.options.sortBy, sort_desc: this.options.sortDesc[0] === true ? 1 : 0,
          allusers: 1
        }
        if (this.is_admin)
          payload["is_admin"] = 1
        if (this.can_admin)
          payload["can_admin"] = 1
        if (this.owner_filter)
          payload["owner"] = this.owner_filter
        this.$store.dispatch('system/fetchSessions', payload)
      }
      clearTimeout(this.timeoutID)
    }
  },
  watch: {
    user_is_admin() {
      // had to make this because on refresh, user_is_admin doesn't update until after the mounted has already run,
      // but mounted needs to run when switching pages where the user_is_admin doesn't update
      console.log("watch updateSessions")
      this.updateSessions()
    },
    items() {
      this.loading = false
    },
    options: {
      handler () {
        this.updateSessions()
      },
      deep: true,
    }
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.timeoutID)
    next()
  }
}
</script>
