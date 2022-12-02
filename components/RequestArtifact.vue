<template>
  <div v-if="record.artifact">
    <v-card class="mx-auto my-2">
      <v-card-title>{{ record.artifact.title }}</v-card-title>
      <v-card-subtitle>
        <div
          v-if="record.artifact.artifact_group.publication != null &&
                record.artifact.artifact_group.publication.artifact_id != record.artifact.id"
          align="left"
          class="mx-0"
        >
          &nbsp;&nbsp;(<a :href="`/artifact/${record.artifact.artifact_group_id}`">newest version</a>)
        </div>
        <div>	
        </div>
<!--	 
     <span>Upload filled data use agreement here  <input type="file" @change="uploadFile" ref="file"></span><br>    -->

      </v-card-subtitle>

       </v-card>

   <div>
     <form @submit.prevent="submitForm">
     <div style="margin-top: 20px; font-weight: bold;">Please download and fill out data use agreement from<a :href="record.dua_url"> this link</a></div>
      <div style="margin-top: 20px; margin-bottom: 20px; font-weight: normal;">Upload filled data use agreement here  <input type="file" @change="uploadFile" ref="file"></div>
     <div style="font-weight: bold;">Briefly describe the research to be done with the dataset</div>
      <v-textarea
        name="research"
	      v-model="research"
        type="text"
        hint="Enter your research purpose" 
        auto-grow
        clearable
      ></v-textarea>
      <div style="margin-top: 20px; font-weight: bold;">Please enter names and emails of researchers that will interact with the data:</div>
      <div v-for="(researcher, index) in researchers" :key="index">
        <v-container>
          <v-row align="center">
            <v-col md="6">
              <v-text-field
                v-model="researcher.name"
                label="Name"
                type="text"
                hint="Enter researcher name"
              ></v-text-field>
            </v-col>
            <v-col md="5">
              <v-text-field
                v-model="researcher.email"
                label="Email"
                type="email"
                hint="Enter researcher email"
              ></v-text-field>
            </v-col>
            <v-col md="1">
              <div>
                <v-icon
                  v-if="researchers.length > 1"
                  color="error"
                  @click="deleteResearcher(index)"
                >
                  mdi-delete
                </v-icon>
              </div>
            </v-col>
          </v-row> 
        </v-container>
      </div>
      <div>
        <v-btn
          class="success ml-2 mb-2"
          fab
          x-small
          @click="addResearcher"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn
          color="success"
          @click="submitRequest"
          style="margin-top: 20px;"
          >
          Submit
      </v-btn>
      </div>
    </form>
    <div v-if="formSubmitted">
      <div v-if="formSubmittedError" class="form-submit-error">
        <p>{{formSubmittedErrorMessage}}</p>
      </div>
      <div v-else class="form-submit-success">
        <p>Request submitted successfully!</p>
      </div>
    </div>
  </div>

   </div>
  <div v-else>
    {{ loadingMessage }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { artifactIcon, artifactColor, bytesToSize } from '@/helpers'

export default {
  name: 'KGArtifactLong',
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  components: {
    ArtifactChips: () => import('@/components/ArtifactChips'),
    ArtifactCurationList: () => import('@/components/ArtifactCurationList'),
    JsonPrettyPrint: () => import('@/components/pretty-print')
  },
  data() {
    return {
      loading: true,
      loaded: false,
      expanded: false,
      history_expanded: false,
      diff_from: -1,
      diff_to: -1,
      diff_results: [],
      diff_results_dialog: false,
      diff_results_tab: "visual",
      loadingMessage: 'Loading...',
      research: "",
      people: "",
      Images: null,
      formSubmitted: false,
      formSubmittedError: false,
      formSubmittedErrorMessage: "",
      researchers: [{name: "", email: ""}]
    }
  },
  mounted() {
    setTimeout(() => {
      this.loadingMessage = 'Error loading'
    }, 5000)
  },
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      favorites: state => state.artifacts.favoritesIDs,
      user_is_admin: state => state.user.user_is_admin
    }),
    sanitizedDescription: function() {
      return this.$sanitize(this.record.artifact.description)
    },
    favorite: {
      get() {
        return this.favorites[this.record.artifact.artifact_group_id] ? true : false
      },
      set(value) {
        if (value)
          this.$store.commit('artifacts/ADD_FAVORITE', this.record.artifact.artifact_group_id)
        else
          this.$store.commit(
            'artifacts/REMOVE_FAVORITE',
            this.record.artifact.artifact_group_id
          )
      }
    },
    tags() {
      let tags = []
      if (this.record.artifact.tags.length > 0) {
        return this.record.artifact.tags.map(e => e.tag)
      }
      let top = this.record.artifact.meta.find(o => o.name == 'top_keywords')
      if (top) {
        tags = tags.concat(JSON.parse(top.value).map(e => e[0]))
      }
      top = this.record.artifact.meta
        ? this.record.artifact.meta.find(o => o.name == 'top_ngram_keywords')
        : null
      if (top) {
        tags = tags.concat(JSON.parse(top.value).map(e => e[0]))
      }
      // return only unique
      let t = [...new Set(tags)]
      t = t.filter(
        el => !this.record.artifact.tags.map(e => e.tag).includes(el)
      )
      return t
    },
    badgesPresent() {
      return (
        typeof this.record.artifact.badges !== 'undefined' &&
        this.record.artifact.badges.length > 0
      )
    },
    languages() {
      let csv = this.record.artifact.meta.find(o => o.name == 'languages')
      if (csv) {
        return csv.value ? csv.value.split(',') : []
      } else {
        return []
      }
    },
    homepage() {
      let hp = this.record.artifact.meta.find(o => o.name == 'homepage')
      if (!hp) return null
      return hp.value
    },
    stars() {
      let stars = this.record.artifact.meta.find(
        o => o.name == 'stargazers_count'
      )
      if (!stars) return null
      return stars.value
    },
    watchers() {
      let watchers = this.record.artifact.meta.find(
        o => o.name == 'watchers_count'
      )
      if (!watchers) return null
      return watchers.value
    },
    license() {
      return this.record.artifact.license
        ? this.record.artifact.license.short_name +
            ' (' +
            this.record.artifact.license.long_name +
            ')'
        : ''
    },
    markdown() {
      let readmes = {}
      this.record.artifact.files.map(f => {
        readmes = f.members.find(m => m.name.toUpperCase() == 'README.MD')
      })
      console.log(readmes)
      if (typeof readmes !== 'undefined' && readmes.file_content)
         return atob(readmes.file_content.content)
    },
    hideOverflow() {
      return {
        hideoverflow: !this.expanded
      }
    },
    isOverflow() {
      if (!this.loaded) return false
      let element = this.$refs['markdown']
      return element.offsetHeight >= 250
    },
    overflowIcon() {
      if (!this.expanded) return 'mdi-chevron-down'
      else return 'mdi-chevron-up'
    },
    overflowText() {
      if (!this.expanded) return 'Show All'
      else return 'Collapse'
    },
    published() {
      return this.record.artifact.publication ? true : false
    }
  },
  methods: {
    async deleteResearcher(index) {
      this.researchers.splice(index, 1);
    },
    async addResearcher() {
      let researcherObj = {
        name: "",
        email: ""
      }
      this.researchers.push(researcherObj);
    },
    async favoriteThis() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        let action = !this.favorite
        this.favorite = !this.favorite
        if (action) {
          // FIXME: backend API
          await this.$favoritesEndpoint.post(this.record.artifact.artifact_group_id, {})
        } else {
          await this.$favoritesEndpoint.delete(this.record.artifact.artifact_group_id)
        }
      }
    },
    uploadFile() {
        this.Images = this.$refs.file.files[0];
    },
    submitForm: function () {
        this.formSubmitted = true
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    convertSize(size) {
      return bytesToSize(size)
    },
    isAdmin() {
      return this.user_is_admin
    },
    isOwner() {
      if (this.user_is_admin) return true
      return typeof this.record.artifact.owner !== 'undefined'
        ? this.record.artifact.owner.id == this.userid
        : false
    },
    async newVersion() {
      let response = await this.$artifactEndpoint.post(
        [this.record.artifact.artifact_group_id, this.record.artifact.id],{})
      this.$store.dispatch('artifacts/fetchArtifact', {
        artifact_group_id: response.artifact.artifact_group_id,
        id: response.artifact.id
      })
      this.$router.push("/artifact/" + response.artifact.artifact_group_id
        + "/" + response.artifact.id + "?edit=true")
    },
    async reImportNewVersion() {
      let response = await this.$artifactEndpoint.post(
        [this.record.artifact.artifact_group_id, this.record.artifact.id],
        { reimport: true })
      this.$router.push("/import")
    },
    async getDiff(from, to) {
      this.diff_from = from
      this.diff_to = to
      let response = await this.$artifactCompareEndpoint.show(
        [this.record.artifact.artifact_group_id, from],
        { target_artifact_id: to}
      )
      this.diff_results = response.curations.map(
        function(x) { return { curation: x }; }
      )
      console.log(this.diff_results)
      for (var i = 0; i < this.diff_results.length; ++i) {
        // NB: opdata from server is a string, not JSON itself.
        this.diff_results[i].curation.opdata =
          JSON.parse(this.diff_results[i].curation.opdata)

        // NB: curations might not have IDs, as in this case,
        // where the server generated a diff.  So we have to
        // cons up an id for the ArtifactCurationList component.
        this.diff_results[i]._id = i
      }
      this.diff_results_dialog = true
    },
    async submitRequest() {
      this.formSubmitted = false;
      let isEntryEmpty = false;
      this.researchers.forEach((researcher) => {
        if (researcher.name == "" || researcher.email == "") {
          isEntryEmpty = true;
        }
      });
      if(!(this.research && this.Images) || isEntryEmpty) {
        this.formSubmittedError = true;
        this.formSubmittedErrorMessage = "Please fill all the fields";
        this.formSubmitted = true;
        return;
      } else {
        this.formSubmittedError = false;
        this.formSubmittedErrorMessage = "";
      }
      const payload = new FormData();
      let file = this.Images;
      let researchersJSON = JSON.stringify(this.researchers);
      payload.append('file', file);
      payload.append('research_desc', this.research);
      payload.append('research_that_interact', researchersJSON);
      let response = await this.$artifactRequestEndpoint.post(
        [this.record.artifact.artifact_group_id, this.record.artifact.id],payload
      );
      if(response.status == 1) {
        this.formSubmittedError = true;
        this.formSubmittedErrorMessage = response.error;
      } else {
        this.formSubmittedError = false;
      }
      this.formSubmitted = true;
    }
  }
}
</script>

<style scoped>
.hideoverflow {
  max-height: 250px;
  overflow: hidden;
}
</style>

<style>
  form {
    padding: 10px;
    border-radius: 5px;
  }

  input {
    padding: 4px 8px;
    margin: 4px;
  }

  span {
    font-size: 18px;
    margin: 4px;
    font-weight: 500;
  }

  .submit {
    font-size: 15px;
    color: #fff;
    padding: 6px 12px;
    border: none;
    margin-top: 8px;
    cursor: pointer;
    border-radius: 5px;
  }

  .form-submit-error {
    color: red;
    padding: 10px;
  }

  .form-submit-success {
    color: green;
    padding: 10px;
  }


</style>