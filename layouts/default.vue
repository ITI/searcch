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
      <v-btn v-if="$auth.loggedIn" class="primary" @click="logout()">Logout</v-btn>
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
      >
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-cloud-search',
          title: 'Search',
          to: '/search'
        }
      ],
      miniVariant: true,
      right: true,
      title: 'SEARCCH Hub'
    }
  },
  methods: {
    async logout () {
      if (confirm("Log out of SEARCCH?")) {
        console.log("Logging out")
        this.$auth.logout()
        location.reload()
      } else {
        // let payload = {
        //   api_key: process.env.KG_API_KEY,
        //   strategy: 'github',
        //   token: this.$auth.getToken('github'),
        // }
        // let login_response
        // try {
        //   login_response = await this.$loginEndpoint.create(payload)
        // } catch (e) {
        //   console.log(e)
        // }
        // console.log(login_response)
        let emails = await this.$axios.$get("https://api.github.com/user/emails")
        console.log(emails)
      }
    }
  }
}
</script>
