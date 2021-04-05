<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to the SEARCCH Hub
        </v-card-title>
        <v-card-text>
          <p>
            Q: What features is the SEARCCH Hub going to have. <br>
            A: The planned feature list can be found at the following <a>link</a>
          </p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  async mounted () {
    // let emails = await this.$axios.$get("https://api.github.com/user/emails")
  }
}
</script>