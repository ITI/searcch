<template>
  <v-app>
    <core-app-bar />
    <core-drawer />
    <core-view />
    <core-footer />
  </v-app>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default defineComponent({
  data: () => ({
    drawer: null
  }),
  components: {
    CoreDrawer: defineAsyncComponent(() => import('@/components/core/Drawer')),
    CoreFooter: defineAsyncComponent(() => import('@/components/core/Footer')),
    CoreAppBar: defineAsyncComponent(() => import('@/components/core/AppBar')),
    CoreView: defineAsyncComponent(() => import('@/components/core/View'))
  }
});
</script>
