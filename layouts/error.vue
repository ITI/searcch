<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <h2 v-if="error.message">
      {{ error.message }}
    </h2>
    <h2 v-if="error.isAxiosError">
      {{ error.request.statusText }}
    </h2>

    <pretty-print
      v-if="error.request.data"
      :value="error.request.data"
    ></pretty-print>

    <pretty-print
      v-if="error.request.response"
      :value="error.request.response"
    ></pretty-print>

    <NuxtLink to="/search">
      Back to search
    </NuxtLink>
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
    PrettyPrint: () => import('@/components/pretty-print')
  },

  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  mounted() {
    console.log(this.error)
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
