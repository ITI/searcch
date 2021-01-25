<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <span v-if="$auth.loggedIn" class="mr-2">Logged in</span>
      <v-btn v-if="$auth.loggedIn" class="primary" @click="logout()">Logout</v-btn>
      <v-btn v-else class="primary" nuxt to="/login">Login</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span
        >&copy; {{ new Date().getFullYear() }} - SEARCCH is supported by the
        National Science Foundation under Grant Numbers 1925773, 1925616,
        1925588, 1925564</span
      ><v-spacer></v-spacer>
      <v-btn
        color="red lighten-2"
        dark
        href="https://forms.gle/nsP4kJVsjAmKKLU86"
        target="_blank"
      >Send Us Feedback</v-btn>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      miniVariant: false,
      right: true,
      title: 'SEARCCH Hub',
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
    }),
    items () {
      let items = [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-cloud-search',
          title: 'Search',
          to: '/search'
        },
      ]
      if (this.user_id) {
        items.push({
          icon: 'mdi-table-heart',
          title: 'Favorites',
          to: '/favorites'
        })
        // items.push({
        //   icon: 'mdi-card-account-details',
        //   title: 'Profile',
        //   to: '/profile'
        // })
        items.push({
          icon: 'mdi-database-import',
          title: 'Import',
          to: '/import'
        })
      }
      return items
    }
  },
  methods: {
    async logout () {
      if (confirm("Log out of SEARCCH?")) {
        console.log("Logging out")
        this.$store.commit('user/SET_USER_ID', null)
        this.$auth.logout()
      }
    }
  }
}
</script>
