<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <logo />
      </div>
      <LazyHydrate never>
        <div>
          <v-card>
            <v-card-title class="primary white--text">
              Welcome to the COMUNDA Portal
            </v-card-title>
            <v-card-text>
              <br />
	      <p>
	      COMUNDA is a collaborative, community-driven platform for
              network dataset sharing and reuse. Datasets can be contributed
              by anyone in the community, and approval process is streamlined to
	      include the dataset provider. Datasets can reside on COMUNDA or at
	      the provider's machines. Datasets can be offered for download, or
	      for access on the provider's machines.
	    </p><p>
              In later stages of the project, COMUNDA will support discussions around
              dataset records, and it will support collaborative labeling of ground truth.
	      COMUNDA will also support researchers' sharing their code, which does dataset
	      cleaning, processing and interpretation.
            </p> <p>
	     COMUNDA also facilitates community-building around these datasets. It
              allows data providers to share the metadata of their datasets with
              the community, and it allows researchers to share their experience with different datasets.
            </p> <p>
              For more information on COMUNDA, check out the
              <a href="https://ant.isi.edu/classnet/" target="_blank" rel="noopener">
                project homepage.
              </a>
	      </p> <p>
              To get started click CONTINUE.
              </p>
              <v-row align="center">
                <v-col cols="12" sm="1" align="right">
                  <v-img
                    src="/images/nsf.png"
                    alt="NSF Logo"
                    width="50"
                  ></v-img>
                </v-col>
                <v-col align="left">
		<em>
                  COMUNDA is supported by the National Science Foundation
                  (NSF) under grant number 8115780.
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
            <v-card-title class="primary white--text">
              Current Features
            </v-card-title>
            <v-card-text>
              <br />
	      <p>
	      COMUNDA has four major functions, which may be accessed using the
              left-hand navigation menu. A summary of each follows.
            </p> <p><b>Search Datasets.</b>
              Users may perform keyword searches to find datasets of
              interest.
            </p> <p><b>Favorite Datasets.</b>
              Users may click on the heart icon on a dataset to add it to a
              favorites list. Favorited datasets are displayed on the
              Favorite Datasets menu for quick recall.
            </p> <p><b>Manage Account.</b>
              Users may add information about themselves such as their
              research interests and institution affiliation. They may also
              access the list of datasets they have
              rated, and their favorites.
            </p> <p>
              The fourth function is reviewing datasets. Users may provide
              reviews for a dataset when viewing it. Presently, reviews
              consist of a 1 to 5 star rating and a comment. Ratings and
              reviews are visible to the community and used by others to help
              them decide whether to invest their time in trying to use a
              specific dataset.
            </p> <p>
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
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  components: {
    Logo: () => import('@/components/Logo'),
    LazyHydrate: () => import('vue-lazy-hydration'),
    Supporters: () => import('@/components/Supporters')
  },
  async mounted() {
    // let emails = await this.$axios.$get("https://api.github.com/user/emails")
    
    //Generate hash from current time
    var sha1 = require('sha1');
    var hash = sha1(Date.now());
    //Get expire time
    let offset = 24*60*60*1000;
    let expireTime = new Date();
    offset += expireTime.getTime();
    expireTime.setTime(offset);
    //Set session id per user
    document.cookie = `session_id=${hash};expires=${expireTime.toUTCString()}`;
  }
}
</script>
