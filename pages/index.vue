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
      </v-card><br><br>
      <v-card>
        <v-card-title class="headline">
          Beta Release Features
        </v-card-title>
        <v-card-text>
          <p>
            The SEARCCH Hub is currently being developed, but we wanted to share with you the existing features 
            and get feedback so we can steer devcelopment in the direction that the community would like to see the Hub go.
          </p>
          <p>
            Currently there are three tabs on the left hand pane you can navigate to: Search, Favorites, and Import.<br>
            The Search page will allow you to search any keywords to find artifacts that match your needs or interests. 
            You can click the favorites on any artifact to store it to your favorites page so you have easy access to it next time.<br>
            Each artifact also has a review button which you can use to add a rating and a review to any artifact, which will be visible to the community 
            and used by others to determine how good an artifact is at a glance.<br>
            You can also import your own artifacts on the imports page. Just provide a URL and our intelligent import alogorithms will do the rest.
          </p>
          <p>
            Please provide comments and report bugs using the Send Us Feedback buttons at the bottom right.
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
