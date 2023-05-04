<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col sm="12" md="10" lg="6">
        <div class="text-center">
          <logo />
        </div>
        <LazyHydrate never>
          <div>
            <v-card>
              <v-card-title class="bg-primary text-white">
                Welcome to the SEARCCH Hub
              </v-card-title>
              <v-card-text>
                <br />
                <p>
                  SEARCCH is a collaborative, community-driven platform for
                  cybersecurity research artifact cataloguing that facilitates
                  sharing and reuse. Artifacts that can be catalogued include
                  tools, data, experiment methodologies and setups, publications,
                  and the like.
                </p>
                <p>
                  SEARCCH builds and maintains a database of metadata about
                  research artifacts that are housed in different places on the
                  internet. It lowers the barrier for sharing these artifacts
                  through automated submission assistant tools that process and
                  extract metadata from artifacts stored in standard locations
                  such as Github.
                </p>
                <p>
                  SEARCCH helps researchers to rapidly find relevant artifacts
                  that will help with their own research by enabling searching
                  over domain-specific keywords and other metadata. In addition to
                  authors, license information, and keywords, SEARCCH also stores
                  information about relationships between related artifacts,
                  making it easier to find multiple artifacts associated with a
                  particular research effort.
                </p>
                <p>
                  SEARCCH also facilitates a community around these artifacts. It
                  allows researchers to share the location of their artifacts with
                  the community and their experience with different artifacts.
                </p>
                <p>
                  For more information on SEARCCH, check out the
                  <a href="https://searcch.cyberexperimentation.org" target="_blank" rel="noopener">
                    project homepage.
                  </a>
                </p>
                <p>
                  To get started click CONTINUE.
                </p>
                <v-row align="center">
                  <v-col cols="12" sm="1" align="right">
                    <v-img src="/images/nsf.png" alt="NSF Logo" width="50"></v-img>
                  </v-col>
                  <v-col align="left">
                    <em>
                      SEARCCH is supported by the National Science Foundation
                      (NSF) under Grant Numbers 1925773, 1925616, 1925588, 1925564
                    </em>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary"  to="/search">
                  Continue
                </v-btn>
              </v-card-actions> </v-card><br />
            <v-card>
              <v-card-title class="bg-primary text-white">
                Current Features
              </v-card-title>
              <v-card-text>
                <br />
                <p>
                  SEARCCH has five major functions. Four may be accessed using the
                  left-hand navigation menu. A summary of each follows.
                </p>
                <p>
                  <b>Search Artifacts.</b>
                  Users may perform keyword searches to find artifacts of
                  interest.
                </p>
                <p>
                  <b>Favorite artifacts.</b>
                  Users may click on the heart icon on an artifact to add it to a
                  favorites list. Favorited artifacts are displayed on the
                  Favorite Artifacts menu for quick recall.
                </p>
                <p>
                  <b>Submit artifact.</b>
                  Users may submit their own artifacts to the SEARCCH catalog.
                  Artifacts published on supported sites may be automatically
                  processed by import assistant tools.
                </p>
                <p>
                  <b>Manage Account.</b>
                  Users may add information about themselves such as their
                  research interests and institution affiliation. They may also
                  access the list of their own artifacts, artifacts they have
                  rated, and their favorites.
                </p>
                <p>
                  The fifth function is reviewing artifacts. Users may provide
                  reviews for an artifact when viewing it. Presently, reviews
                  consist of a 1 to 5 star rating and a comment. Ratings and
                  reviews are visible to the community and used by others to help
                  them decide whether to invest their time in trying to use a
                  specific artifact.
                </p>
                <p>
                  Please provide comments and report bugs using the SEND US
                  FEEDBACK button at the bottom right hand side of the page.
                </p>
              </v-card-text>
            </v-card>
          </div>
        </LazyHydrate>
        <br />
        <div>
          <supporters />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import * as sha1 from 'sha1';

export default defineComponent({
  components: {
    Logo: defineAsyncComponent(() => import('@/components/Logo')),
    Supporters: defineAsyncComponent(() => import('@/components/Supporters'))
  },
  async mounted() {
    //Generate hash from current time
    var hash = sha1(Date.now());
    //Get expire time
    let offset = 24 * 60 * 60 * 1000;
    let expireTime = new Date();
    offset += expireTime.getTime();
    expireTime.setTime(offset);
    //Set session id per user
    document.cookie = `session_id=${'no_login_' + hash};expires=${expireTime.toUTCString()}`;
  }
});
</script>
