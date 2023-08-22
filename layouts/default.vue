<template>
  <v-app light>
    <v-navigation-drawer v-model="drawer" :rail="miniVariant" :order="order" permanent position="fixed">
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="`main${i}`" :href="'href' in item ? item.href : undefined"
          :target="'href' in item ? '_blank' : undefined" :to="!('href' in item) ? item.to : undefined" router exact>
          <template v-slot:prepend="{ on, attrs }">
              <v-tooltip location="right">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">{{ item.icon }}</v-icon>
                </template>
                <span>{{ item.title }}</span>
              </v-tooltip>
          </template>
          <v-list-item-title v-text="item.title" />
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="adminItems.length">
        <v-list-item v-for="(item, i) in adminItems" :key="`main${i}`" :href="'href' in item ? item.href : undefined"
          :target="'href' in item ? '_blank' : undefined" :to="!('href' in item) ? item.to : undefined" router exact>
          <template v-slot:prepend="{ on, attrs }">
              <v-tooltip location="right">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">{{ item.icon }}</v-icon>
                </template>
                <span>{{ item.title }}</span>
              </v-tooltip>
          </template>
          <v-list-item-title v-text="item.title" />
        </v-list-item>
      </v-list>
      <v-divider v-if="adminItems.length"></v-divider>
      <v-list>
        <v-list-item v-for="(item, i) in footerItems" :key="`footer${i}`" :href="'href' in item ? item.href : undefined"
          :target="'href' in item ? '_blank' : undefined" :to="!('href' in item) ? item.to : undefined" router exact>
          <template v-slot:prepend="{ on, attrs }">
              <v-tooltip location="right">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">{{ item.icon }}</v-icon>
                </template>
                <span>{{ item.title }}</span>
              </v-tooltip>
          </template>
          <v-list-item-title v-text="item.title" />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar position="fixed" elevation="0" class="border-b">
      <v-btn icon @click.stop="() => { miniVariant = !miniVariant }">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <!-- For some reasons v-app-bar-title will crash, use bare text instead -->
      {{ title }}
      <v-spacer />
      <span v-if="$auth.loggedIn" class="mr-2">{{ $auth.user.name }}</span>
      <v-btn v-if="$auth.loggedIn && user_can_admin && !user_is_admin" icon @click="() => setAdmin(true)">
        <v-icon style="color: green">mdi-alpha-a-circle</v-icon>
      </v-btn>
      <v-btn v-else-if="$auth.loggedIn && user_can_admin && user_is_admin" icon @click="() => setAdmin(false)">
        <v-icon style="color: red">mdi-alpha-a-circle</v-icon>
      </v-btn>
      <v-btn v-if="$auth.loggedIn" class="bg-primary" @click="() => logout()">Logout&nbsp;<v-icon
          size="small">mdi-logout</v-icon></v-btn>
      <v-menu v-else open-on-click location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn class="bg-primary" v-bind="props">
            Login&nbsp;<v-icon size="small">mdi-login</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-btn class="bg-primary" @click="() => gitHubLogin()">
              GitHub&nbsp;<v-icon size="small">mdi-github</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn class="bg-primary" @click="() => googleLogin()">
              Google&nbsp;<v-icon size="small">mdi-google</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn class="bg-primary" @click="() => cilogonLogin()">
              CILogon&nbsp;<v-icon size="small">mdi-login</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-separator></v-separator>
    </v-app-bar>
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} - SEARCCH is supported by the
        National Science Foundation under Grant Numbers 1925773, 1925616,
        1925588, 1925564</span>
      <v-btn color="error" theme="dark" raised href="https://forms.gle/nsP4kJVsjAmKKLU86" target="_blank"
        rel="noopener">Send Us Feedback</v-btn>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'pinia'
import { userStore } from '../stores/user'

export default defineComponent({
  data() {
    return {
      order: 1,
      drawer: true,
      miniVariant: false,
      right: true,
      title: 'SEARCCH Hub',
    }
  },
  async beforeMount() {
    if (this.$auth.loggedIn) {
      const payload = {
        strategy: this.$auth.data?.value?.provider,
        token: `Bearer ${this.$auth.data?.value?.token}`,
      }

      if (window.Cypress) {
        payload.strategy = 'google'
        payload.token = `Bearer ${localStorage.getItem('token')}`
      }

      this.$userStore.user_token = payload.token
      await this.$loginEndpoint.create(payload).then((response) => {
        if (typeof response !== 'undefined' && response.userid >= 0) {
          this.$userStore.user = response.person
          this.$userStore.userid = response.userid
          this.$userStore.user_is_admin = response.is_admin
          this.$userStore.user_can_admin = response.can_admin
          this.$artifactsStore.fetchFavorites(response.userid)
        }
      })
    }
  },
  mounted() {
    this.miniVariant = window.innerWidth < 992;
  },
  computed: {
    ...mapState(userStore, {
      userid: state => state.userid,
      user_is_admin: state => state.user_is_admin,
      user_can_admin: state => state.user_can_admin
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
        items.push({
          icon: 'mdi-table-heart',
          title: 'Favorite Artifacts',
          to: '/favorites'
        })
        items.push({
          icon: 'mdi-box',
          title: 'My Artifacts',
          to: '/myartifacts'
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
    adminItems() {
      let adminItems = []
      if (this.$auth.loggedIn && this.user_is_admin) {
        adminItems.push({
          icon: 'mdi-wrench',
          title: 'Artifacts',
          to: '/admin/artifacts'
        })
        adminItems.push({
          icon: 'mdi-wrench',
          title: 'Artifact Imports',
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
        adminItems.push({
          icon: 'mdi-wrench',
          title: 'Claims',
          to: '/admin/claims'
        })
      }
      return adminItems
    },
    footerItems() {
      let footerItems = [
        {
          icon: 'mdi-information',
          title: 'About',
          to: '/'
        },
        {
          icon: 'mdi-information',
          title: 'Best Practices',
          href: 'https://searcch.cyberexperimentation.org/best-practices'
        },
        {
          icon: 'mdi-frequently-asked-questions',
          title: 'FAQ',
          to: '/faqs'
        }
      ]
      return footerItems
    }
  },
  methods: {
    async gitHubLogin() {
      await this.$auth.loginWith('github')
    },
    async googleLogin() {
      await this.$auth.loginWith('google')
    },
    async cilogonLogin() {
      await this.$auth.loginWith('cilogon')
    },
    async logout() {
      if (confirm('Log out of SEARCCH?')) {
        console.log('Logging out')
        this.$userStore.logout()
        this.$systemStore.logout()
        this.$auth.logout()
      }
    },
    async setAdmin(mode) {
      console.log('Setting admin mode', mode)
      await this.$loginEndpoint
        .put({ is_admin: mode })
        .then(response => {
          this.$userStore.user_is_admin = mode
          if (!mode) {
            this.$userStore.adminOff()
            this.$systemStore.adminOff()
            if (this.$route.name.startsWith('admin')) {
              navigateTo('/')
            }
          }
        })
        .catch(error => {
          console.log('Failed to set admin mode', mode, error)
        })
    }
  }
});
</script>

<style>
.v-footer {
  flex-wrap: nowrap;
  z-index: 9;
  justify-content: space-between;
}

@media screen and (max-width: 992px) {
  .v-footer {
    flex-direction: column;
    position: relative;
  }
}
</style>
