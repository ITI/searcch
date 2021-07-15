<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <LazyHydrate never>
        <div>
          <div class="text-center">
            <logo />
          </div>
          <v-card>
            <v-card-text>
              <p>
                <b>Q: What features is the SEARCCH Hub going to have.</b> <br />
                A: The planned feature list can be found at the following
                <a>link</a>
              </p>
            </v-card-text>
          </v-card>
          <v-card class="mt-2">
            <v-card-text>
              <p>
                <b>Q: When is a full version set to be released?</b> <br />
                A: The development of the platform is ongoing with feedback from
                the community and no official release date is set.
              </p>
            </v-card-text>
          </v-card>
        </div>
      </LazyHydrate>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  components: {
    Logo: () => import('@/components/Logo'),
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  async mounted() {
    // let emails = await this.$axios.$get("https://api.github.com/user/emails")
  }
}
</script>
