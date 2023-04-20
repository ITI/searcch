<template>
  <v-container>
    <v-row justify="left" align="top">
      <v-row class="ml-1 mb-2">
        <h1>Importers</h1>
      </v-row>
      <v-divider></v-divider><br />
      <ImporterList
        v-if="importers && importers.length"
        :importers="importers"
      ></ImporterList>
      <div v-else>{{ loadingMessage }}</div>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState } from 'pinia'
import { userStore } from '~/stores/user'
import { systemStore } from '~/stores/system'

export default defineComponent({
  components: {
    ImporterList: defineAsyncComponent(() => import('@/components/ImporterList'))
  },
  data() {
    return {
      loadingMessage: 'Loading importers...',
      pollingID: null,
      timeoutID: null
    }
  },
  async mounted() {
    this.$userStore.fetchUser()
    this.loadingMessage = 'Loading importers...'
    this.updateImporters()
    this.timeoutID = setTimeout(() => {
      this.loadingMessage = 'No importers found'
      clearInterval(this.pollingID)
    }, 5000)
    this.pollingID = setInterval(
      function() {
        this.updateImporters()
      }.bind(this),
      5000
    )
  },
  computed: {
    ...mapState(systemStore, ['importers']),
    ...mapState(userStore, ['user_is_admin'])
  },
  methods: {
    updateImporters() {
      if (this.user_is_admin) {
        this.$systemStore.fetchImporters()
      }
      if (!this.importers || !this.importers.length) {
        //clearInterval(this.pollingID)
      }
    }
  },
  watch: {
    user_is_admin() {
      // had to make this because on refresh, user_is_admin doesn't update until after the mounted has already run,
      // but mounted needs to run when switching pages where the user_is_admin doesn't update
      this.updateImporters()
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.pollingID)
    clearTimeout(this.timeoutID)
    next()
  }
});
</script>
