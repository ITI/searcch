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
        </v-card-actions> </v-card
      ><br />
      <v-card>
        <v-card-title class="headline">
          Alpha Release
        </v-card-title>
        <v-card-text>
          <p>
            The SEARCCH Hub is now open for alpha testing by invitation only.
            Once alpha testing is complete, we will move to beta testing.
          </p>
          <p>
            Volunteering to be a beta tester will help the community in
            providing the critical feedback we need to evolve the hub into a
            valuable community resource. Alpha testers may also be beta testers.
            Please contact us if you would like to be a beta tester.
          </p>
        </v-card-text> </v-card
      ><br />
      <v-card>
        <v-card-title class="headline">
          Alpha Features
        </v-card-title>
        <v-card-text>
          <p>
            There are three navigation tabs on the left hand pane: Search,
            Favorites, and Import.
          </p>
          <p>
            The Search page allows users to perform keyword searches to find
            artifacts of interest. You may click the favorites icon on any
            artifact to store it in your favorites list for quick, future
            recall.
          </p>
          <p>
            Each artifact has a review button which you can use to add a rating
            and a review to any artifact. Ratings and reviews are visible to the
            community and used by others to help them decide whether to invest
            their time in trying to use the reviewed/rated artifact.
          </p>
          <p>
            The Imports page is used to import your own artifacts into the hub.
            To import an artifact, it must first be published on the Internet.
            Provide the artifact URL, and our intelligent import tool will
            prepare the artifact for review and publishing. For the alpha
            release, github, ACM digital library, ieeexplore, and Zenodo are the
            only supported internet repositories.
          </p>
          <p>
            Please provide comments and report bugs using the Send Us Feedback
            button at the bottom right hand side of the page.
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
  async mounted() {
    // let emails = await this.$axios.$get("https://api.github.com/user/emails")
  }
}
</script>
