<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    :image="image"
    color="grey-darken-2"
    theme="dark"
    floating
    mobile-breakpoint="991"
    persistent
    width="260"
  >
    <template v-slot:img="attrs">
      <v-img
        v-bind="attrs"
        gradient="to top, rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)"
      ></v-img>
    </template>

    <v-list-item lines="two">
      <v-list-item-title class="text-h6">
        SEARCCH Admin
      </v-list-item-title>
    </v-list-item>

    <v-divider class="mx-3 mb-3" />

    <v-list nav>
      <!-- Bug in Vuetify for first child of v-list not receiving proper border-radius -->
      <div />

      <nuxt-link
        v-for="(link, i) in links"
        :key="i"
        :to="link.to"
      >
        <v-list-item
          active-class="primary white--text"
        >
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-title v-text="link.text" />
        </v-list-item>
      </nuxt-link>
    </v-list>

    <template v-slot:append>
      <v-list nav>
        <v-list-item to="#">
          <v-list-item-action>
            <v-icon>mdi-package-up</v-icon>
          </v-list-item-action>

          <v-list-item-title class="font-weight-light">
            Something else
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapState } from 'pinia'
import { appStore } from '~/stores/app'

export default defineComponent({
  props: {
    opened: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    links: [
      {
        to: '/dashboard-example/',
        icon: 'mdi-view-dashboard',
        text: 'Dashboard'
      },
      {
        to: '/dashboard-example/user-profile',
        icon: 'mdi-account',
        text: 'User Profile'
      },
      {
        to: '/dashboard-example/table-list',
        icon: 'mdi-clipboard-outline',
        text: 'Table List'
      },
      {
        to: '/dashboard-example/typography',
        icon: 'mdi-format-font',
        text: 'Typography'
      },
      {
        to: '/dashboard-example/icons',
        icon: 'mdi-chart-bubble',
        text: 'Icons'
      },
      {
        to: '/dashboard-example/maps',
        icon: 'mdi-map-marker',
        text: 'Maps'
      },
      {
        to: '/dashboard-example/notifications',
        icon: 'mdi-bell',
        text: 'Notifications'
      }
    ]
  }),

  computed: {
    ...mapState(appStore, ['image', 'color']),
    inputValue: {
      get() {
        return this.$appStore.drawer
      },
      set(val) {
        this.$appStore.drawer = val
      }
    }
  },
});
</script>
