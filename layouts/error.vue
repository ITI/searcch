<template>
  <v-app dark>
    <h1> {{ errTitle }} </h1>
    <h2 v-if="error.message">
      {{ error.message }}
    </h2>
    <h2 v-if="error.isAxiosError">
      {{ error.request.statusText }}
    </h2>

    <pretty-print
      v-if="error.request"
      :value="error.request.data"
    ></pretty-print>

    <pretty-print
      v-if="error.request"
      :value="error.request.response"
    ></pretty-print>

    <a @click="navigate">Start over</a>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  components: {
    PrettyPrint: () => import('@/components/pretty-print'),
  },
  computed: {
    isNotFound() {
      return this.error.statusCode === 404;
    },
    errTitle() {
      return this.isNotFound ? '404 Not Found' : 'An error occurred';
    },
  },
  methods: {
    navigate() {
      if (this.error.statusCode >= 500) {
        window.history.go(0);
      } else {
        this.$router.push('/');
      }
    }
  },
  mounted() {
    console.log(this.error)
    if (
      this.error.statusCode === 401 &&
      this.error.response.data.message.includes('session token')
    ) {
      console.log('session token')
      this.$store.commit('user/LOGOUT')
      this.$auth.logout()

      // auto log them back in
      alert('Your session expired. The system will now log you back in')
      this.$auth.loginWith('github')
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
