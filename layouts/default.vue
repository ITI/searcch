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
          :key="`main${i}`"
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
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          v-for="(item, i) in footerItems"
          :key="`footer${i}`"
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
      <span v-if="$auth.loggedIn" class="mr-2" v-text="$auth.user.name"></span>
      <v-btn v-if="$auth.loggedIn" class="primary" @click="logout()"
        >Logout</v-btn
      >
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
        rel="noopener"
        >Send Us Feedback</v-btn
      >
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
  data() {
    return {
      clipped: true,
      drawer: true,
      miniVariant: false,
      right: true,
      title: 'SEARCCH Hub'
    }
  },
  computed: {
    ...mapState({
      userid: state => state.user.userid
    }),
    items() {
      let items = [
        {
          icon: 'mdi-cloud-search',
          title: 'Search Artifacts',
          to: '/search'
        }
      ]
      if (this.$auth.loggedIn) {
        console.log('logged in menu')
        // items.push({
        //   icon: 'mdi-apps',
        //   title: 'Dashboard',
        //   to: '/dashboard'
        // })
        items.push({
          icon: 'mdi-table-heart',
          title: 'Favorite Artifacts',
          to: '/favorites'
        })
        items.push({
          icon: 'mdi-database-import',
          title: 'Submit Artifact',
          to: '/import'
        })
        items.push({
          icon: 'mdi-account-cog',
          title: 'Manage Account',
          to: '/profile'
        })
      }
      return items
    },
    footerItems() {
      let footerItems = [
        {
          icon: 'mdi-information',
          title: 'About',
          to: '/'
        },
        {
          icon: 'mdi-frequently-asked-questions',
          title: 'FAQs',
          to: '/faqs'
        }
      ]
      return footerItems
    }
  },
  methods: {
    async logout() {
      if (confirm('Log out of SEARCCH?')) {
        console.log('Logging out')
        this.$store.commit('user/LOGOUT')
        this.$auth.logout()
      }
    }
  }
}
</script>
