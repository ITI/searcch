<template>
  <v-container>
    <v-row justify="left" align="top">
      <v-row align="center">
        <v-col cols="1">
          <h3>Filters:</h3>
        </v-col>
        <v-col cols="1">
          <v-list-subheader>
            Can Admin
          </v-list-subheader>
        </v-col>
        <v-col cols="1">
          <v-checkbox v-model="can_admin" @update:model-value="updateUsers()"></v-checkbox>
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
    </v-row>
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
          density="compact"
        ></v-text-field> -->
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :loading="loading"
        v-model:options="options"
        :footer-props="{ 'items-per-page-options': [10, 20, 50, 100, -1] }"
        :server-items-length="total"
        dense
      >
      <template v-slot:top>
          <v-dialog v-model="dialogModify" max-width="500px">
            <v-sheet
              class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block"
              color="blue-grey-darken-3"
              theme="dark"
            >
              <div class="text-grey-lighten-1 text-body-2 mb-4">
                Are you sure you want to modify the admin privileges of user {{user_details.id}}?
              </div>

              <v-btn variant="plain" color="success" @click="confirmChangeAdminPrivilege()">OK</v-btn>
              <v-btn variant="plain" color="error" @click="modifyPrivilegeDialog(false)">Cancel</v-btn>
            </v-sheet>
          </v-dialog>
        </template>
        <template v-slot:item.id="{ item }">
          <v-tooltip location="bottom">
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
          <v-tooltip location="bottom" :disabled="user_id == item.id">
            <template v-slot:activator="{ on }">
              <span>
                <v-checkbox-btn 
                  style="padding: 10px" 
                  :value="item.can_admin" 
                  :disabled="user_id == item.id" 
                  v-on="on" 
                  :color="'primary'"
                  @click="user_id != item.id ? modifyPrivilegeDialog(true, item) : () => {}"
                ></v-checkbox-btn>
              </span>
            </template>
            <span>Modify User Admin Privilege</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import { userStore } from '~/stores/user'
import { systemStore } from '~/stores/system'

export default defineComponent({
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
        { text: 'Can Admin', value: 'can_admin', align: 'center' }
      ],
      loading: true,
      options: {
        itemsPerPage: 20,
        page: 1,
        sortDesc: [true]
      },
      search: '',
      dialogModify: false,
      user_details: {}
    }
  },
  async mounted() {
    this.$userStore.fetchUser()
    this.loadingMessage = 'Loading users...'
    this.updateUsers()
    this.timeoutID = setTimeout(() => {
      this.loadingMessage = 'No users found'
    }, 5000)
  },
  computed: {
    ...mapState(userStore, ['user_is_admin', 'user_id']),
    ...mapState(systemStore, ['users', 'page', 'pages', 'total']),
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
        this.$systemStore.fetchUsers(payload)
      }
      clearTimeout(this.timeoutID)
    },
    modifyPrivilegeDialog(show, item = {}) {
      this.user_details = {...item};
      this.user_details.index = this.items.indexOf(item);
      this.dialogModify = show;
    },
    async confirmChangeAdminPrivilege() {
      var data = {
        can_admin: this.user_details.can_admin ? 'f' : 't',
        user_id: this.user_details.id,
        idx: this.user_details.index  // use this index to update the user list
      }
      await this.$systemStore.modifyAdminPrivilege(data);
      this.modifyPrivilegeDialog(false);
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
});
</script>
