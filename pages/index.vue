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
                  (NSF) under grant number 8115780 and 1823192.
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
    <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500"
    >
      <template v-slot:activator="{ on, attrs }">
      </template>
      <v-card>
        <v-card-title>
          Enter Affiliation and Designation
        </v-card-title>
        <v-col cols="12">
                <v-text-field
                  label="Position*"
                  required
                  v-model ="localuser.position"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                    <v-combobox
                      label="Affiliation*"
                      multiple
                      small-chips
                      deletable-chips
                      v-model="userAffiliation"
                      hint="Select applicable organization from the list or type in your own"
                      item-text="org.name"
                      item-value="org.name"
                      return-object
                      required
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              No results matching "<strong>{{
                                orgSearch
                              }}</strong
                              >". Press <kbd>tab</kbd> to create a new one
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="addFields"
          >
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
      return {
        dialog: false,
        localuser:'',
        userAffiliation:[],
        userPosition:null,
      }
    },
  components: {
    Logo: () => import('@/components/Logo'),
    LazyHydrate: () => import('vue-lazy-hydration'),
    Supporters: () => import('@/components/Supporters')
  },
  computed:{
    ...mapState({
      user: state => state.user,
      person:state =>state.user.user,
      organization: state => state.user.organization,
      userid: state => state.user.userid,
    })
  },
  watch:{
    person(val) {
      this.localuser = JSON.parse(JSON.stringify(val))
    },
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
    console.log(this.user)
    if (this.$auth.loggedIn){
    this.$store.dispatch('user/fetchUser')
    this.$store.dispatch('user/fetchOrgs')

      let payload = {
      verified: 1,
      all: 1
    }
    let response = await this.$organizationEndpoint.index(payload)
    console.log(response )
      if(this.user.organization.length == 0){
        this.dialog = true
      }
      this.localuser = JSON.parse(JSON.stringify(this.person))
      this.userAffiliation = this.organization ? this.organization : []
      this.localuser.position = this.localuser.position ? this.localuser.position : ''
      console.log(this.localuser)
      //this.userPosition = this.position
    }
  },
  methods:{
    async addFields(){
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        await this.$userEndpoint.update(this.userid, this.localuser)

        // create any affiliations that were added
        this.userAffiliation.forEach((affil, index, object) => {
          if (typeof affil === 'string') {
            this.$store.dispatch('user/createAffiliation', affil)
            object.splice(index, 1)
          }
        })
        this.$store.dispatch('user/fetchUser')
      }
      if(this.localuser.position && this.userAffiliation){
        this.dialog=false
      }
      
    }
  }
  // async computed(){
    
  // }
}
</script>
