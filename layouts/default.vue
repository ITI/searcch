<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      permanent
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="`main${i}`"
          :href="'href' in item ? item.href : undefined"
          :target="'href' in item ? '_blank' : undefined"
          :to="!('href' in item) ? item.to : undefined"
          router
          exact
        >
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-on="on">{{ item.icon }}</v-icon>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="adminItems.length">
        <v-list-item
          v-for="(item, i) in adminItems"
          :key="`main${i}`"
          :href="'href' in item ? item.href : undefined"
          :target="'href' in item ? '_blank' : undefined"
          :to="!('href' in item) ? item.to : undefined"
          router
          exact
        >
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-on="on">{{ item.icon }}</v-icon>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider v-if="adminItems.length"></v-divider>
      <v-list>
        <v-list-item
          v-for="(item, i) in footerItems"
          :key="`footer${i}`"
          :href="'href' in item ? item.href : undefined"
          :target="'href' in item ? '_blank' : undefined"
          :to="!('href' in item) ? item.to : undefined"
          router
          exact
        >
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-on="on">{{ item.icon }}</v-icon>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
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
      <v-img
                    src="/images/comunda logo vertical.png"
                    alt="comunda Logo"
                    max-width="15"
                    max-height = "20"
                    class="ma-2"
                  ></v-img>
      <v-toolbar-title>
        {{title}}
      </v-toolbar-title>
      <v-spacer />
      <span v-if="$auth.loggedIn" class="mr-2" v-text="$auth.user.name"></span>
      <v-btn
        v-if="$auth.loggedIn && this.user_can_admin && !this.user_is_admin"
        icon
        @click="setAdmin(true)"
      >
        <v-icon style="color: green">mdi-alpha-a-circle</v-icon>
      </v-btn>
      <v-btn
        v-else-if="$auth.loggedIn && this.user_can_admin && this.user_is_admin"
        icon
        @click="setAdmin(false)"
      >
        <v-icon style="color: red">mdi-alpha-a-circle</v-icon>
      </v-btn>
      <v-btn v-if="$auth.loggedIn" class="primary" @click="logout()"
        >Logout&nbsp;<v-icon small>mdi-logout</v-icon></v-btn
      >
      <v-menu v-else
        open-on-click
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="primary"
            v-bind="attrs"
            v-on="on"
          >
            Login&nbsp;<v-icon small>mdi-login</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-btn class="primary" nuxt @click="gitHubLogin()">
              GitHub&nbsp;<v-icon small>mdi-github</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn class="primary" nuxt @click="googleLogin()">
              Google&nbsp;<v-icon small>mdi-google</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn class="primary" nuxt @click="cilogonLogin()">
              CILogon&nbsp;<v-icon small>mdi-login</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span
        >&copy; {{ new Date().getFullYear() }} - COMUNDA is supported by the
        National Science Foundation under grant number 8115780 and 1823192.
	</span
      ><v-spacer></v-spacer>
      <v-btn
        color="error"
        dark
        raised
        href="mailto:comunda-ops@googlegroups.com"
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
  data() {
    return {
      clipped: true,
      drawer: true,
      miniVariant: false,
      right: true,
      title: 'COMUNDA Portal'
    }
  },
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      user_is_admin: state => state.user.user_is_admin,
      user_can_admin: state => state.user.user_can_admin
    }),
    items() {
      let items = [
        {
          icon: 'mdi-cloud-search',
          title: 'Search Datasets',
          to: '/search'
        }
      ]
      if (this.$auth.loggedIn) {
        items.push({
          icon: 'mdi-table-heart',
          title: 'Favorite Datasets',
          to: '/favorites'
        })
        items.push({
          icon: 'mdi-label-multiple-outline',
          title: 'Label Datasets',
          to: '/addLabels'
        })
      items.push({
          icon: 'mdi-share-all-outline',
          title: 'Contribute Datasets',
          href: 'https://steelisi.github.io/CLASSNET-DOCS/contribute/'
        })
        items.push({
          icon: 'mdi-account-cog',
          title: 'Manage Account',
          to: '/profile'
        })
      }
      return items
    },
    adminItems() {
      let adminItems = []
      if (this.$auth.loggedIn && this.user_is_admin) {
        adminItems.push({
          icon: 'mdi-wrench',
          title: 'Datasets',
          to: '/admin/artifacts'
        })
        adminItems.push({
          icon: 'mdi-wrench',
          title: 'Dataset Imports',
          to: '/admin/imports'
        })
        adminItems.push({
          icon: 'mdi-wrench',
          title: 'Users',
          to: '/admin/users'
        })
        adminItems.push({
          icon: 'mdi-wrench',
          title: 'Login Sessions',
          to: '/admin/sessions'
        })
        adminItems.push({
          icon: 'mdi-wrench',
          title: 'Importer Status',
          to: '/admin/importers'
        })
      }
      return adminItems
    },
    footerItems() {
      let footerItems = [
        {
          icon: 'mdi-information',
          title: 'About',
          href: 'https://steelisi.github.io/CLASSNET-DOCS/'
        },
        {
          icon: 'mdi-frequently-asked-questions',
          title: 'Support',
          href: 'https://steelisi.github.io/CLASSNET-DOCS/support'
        }
      ]
      return footerItems
    }
  },
  methods: {
    async gitHubLogin() {
      let response = await this.$auth.loginWith('github')
    },
    async googleLogin() {
      let response = await this.$auth.loginWith('googlecustom')
    },
    async cilogonLogin() {
      let response = await this.$auth.loginWith('cilogon')
    },
    async logout() {
      if (confirm('Log out of COMUNDA?')) {
        console.log('Logging out')
        this.$store.commit('user/LOGOUT')
        this.$store.commit('system/LOGOUT')
        this.$auth.logout()
      }
    },
    async setAdmin(mode) {
      console.log('Setting admin mode', mode)
      await this.$loginEndpoint
        .put({ is_admin: mode })
        .then(response => {
          this.$store.commit('user/SET_USER_IS_ADMIN', mode)
          if (!mode) {
            this.$store.commit('user/ADMIN_OFF')
            this.$store.commit('system/ADMIN_OFF')
            if (this.$route.name.startsWith('admin')) {
              this.$router.push('/')
            }
          }
        })
        .catch(error => {
          console.log('Failed to set admin mode', mode, error)
        })
    }
  }
}
</script>
