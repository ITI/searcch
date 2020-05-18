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
            The SEARCCH hub is a collaborative, community-driven platform that
            lowers the barrier to sharing by aiding researchers in packaging,
            importing, locating, understanding, and reusing experiment
            artifacts. The artifacts organized by the hub, including tools,
            methodologies, documentation, and data, can be deployed to community
            testbeds for performing new experiments.
          </p>
          <p>
            For more information on SEARCCH, check out the
            <a href="https://searcch.cyberexperimentation.org" target="_blank">
              project homepage.
            </a>
          </p>
          <p>
            To get started click continue...
          </p>
          <v-row align="center">
            <v-col cols="12" sm="1" align="right">
              <v-img src="/images/nsf.png" alt="NSF Logo" width="50"></v-img>
            </v-col>
            <v-col align="left">
              <em>
                SEARCCH is supported by the National Science Foundation under
                Grant Numbers 1925773, 1925616, 1925588, 1925564
              </em>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/search">
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  }
}
</script>
