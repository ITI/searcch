<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to the SEARCCH Portal
        </v-card-title>
        <v-card-text>
          <p>
            SEARCCH: Sharing Expertise and Artifacts for Reuse through a
            Cybersecurity Community Hub. SEARCCH is creating a collaborative,
            community-driven platform that lowers the barrier to sharing by
            aiding researchers in packaging, importing, locating, understanding,
            and reusing experiment artifacts. The artifacts organized by the
            platform, including tools, methodologies, documentation, and data,
            can be deployed to community testbeds for performing new
            experiments. Concurrently, SEARCCH engages in outreach activities to
            build an active, diverse, online community around the hub to enable
            direct sharing of expertise and crowdsourcing research ideas and
            experiment design. Through a process of continuous learning and
            improvement, the hub will grow over time to include collections of
            artifacts covering a broad range of cybersecurity research topics
            and add support for newly identified community needs. These
            activities together will transform the way cybersecurity research is
            conducted in the cybersecurity community, improving the overall
            scientific quality of cybersecurity research through validation,
            repeatable sharing and reuse, and a collective approach to building
            on research results.
          </p>
          <p>
            For more information on SEARCCH, check out the
            <a href="https://searcch.cyberexperimentation.org" target="_blank">
              project homepage </a
            >.
          </p>
          <div class="text-xs-right">
            <em><small>&mdash; SEARCCH Team</small></em>
          </div>
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
