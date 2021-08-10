<template>
  <span>
    <v-layout column justify-left align-top>
      <v-row class="ml-1 mb-2">
        <h1>Importers</h1>
      </v-row>
      <v-divider></v-divider><br />
      <ImporterList
        v-if="importers && importers.length"
        :importers="importers"
      ></ImporterList>
      <div v-else>{{ loadingMessage }}</div>
    </v-layout>
  </span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
    ImporterList: () => import('@/components/ImporterList')
  },
  data() {
    return {
      loadingMessage: 'Loading importers...',
      pollingID: null,
      timeoutID: null
    }
  },
  async mounted() {
    this.$store.dispatch('user/fetchUser')
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
    ...mapState({
      user_is_admin: state => state.user.user_is_admin,
      importers: state => state.system.importers
    })
  },
  methods: {
    updateImporters() {
      if (this.user_is_admin) {
        this.$store.dispatch('system/fetchImporters')
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
}
</script>
