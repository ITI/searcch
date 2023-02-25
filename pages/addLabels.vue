<template>
    <div>
        <div class="text-center">
      <logo />
    </div>
    <v-card>
      <v-card-title class="primary white--text">
        Contribute Labels to existing Datasets
      </v-card-title>
      <v-card-text>
        <v-stepper
        v-model="e6"
        vertical
        >

    <v-stepper-step
      :complete="e6 > 1"
      step="1"
    >
      Select a Dataset
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-card
        class="mb-12"
        height="200px"
      >
        <v-card-title>Choose a dataset from the dropdown below. You can also type the dataset name</v-card-title>
        <v-card-text>
          <v-autocomplete
  clearable
  dense
  filled
  solo
  v-model = "selectedName"
  :items="titles"

></v-autocomplete>
          <div style ="color:red">{{ errorMessage1 }}</div>
        </v-card-text>
      </v-card>
      <v-btn
        color="primary"
        @click="validateDataset"
      >
        Continue
      </v-btn>

    </v-stepper-content>

    <v-stepper-step
      :complete="e6 > 2"
      step="2"
    >
      Upload a link with labels
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-card
        color=""
        class="mb-12"
        height="300"
      >
         <v-card-title>Provide a link and type for the labels in the textbox below</v-card-title>
        <v-card-text>
          You can also refer to COMUNDA's documentation about submitting labels to dataset <a href = "https://steelisi.github.io/CLASSNET-DOCS/labels/">here</a><br/><br/>

        Enter a labelling approach name as id for the label. The id should be text which can summarize the label that you are providing<br/> <br/>
         <v-row>
            <v-col><v-text-field clearable label="https://www.example.com" prepend-icon="mdi-link-plus" outlined v-model="labelLink"></v-text-field></v-col>
            <v-col><v-text-field clearable label="Label Id" prepend-icon="mdi-label" outlined v-model="labelType"></v-text-field></v-col>
          </v-row><br/>
          <div style ="color:red">{{ errorMessage2 }}</div>
        </v-card-text>

      </v-card>
      <v-btn
        color="primary"
        @click="validateLinkId"
      >
        Continue
      </v-btn>
      <v-btn text @click="e6 = 1">
        Back
      </v-btn>
    </v-stepper-content>

    <v-stepper-step
      :complete="e6 > 3"
      step="3"
    >
      Review Content
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-card

        class="mb-12"
        height="200"
      >
      File name: {{ selectedName }} <br/>
      Label Link: {{labelLink }} <br/>
      Label Type: {{ labelType }}

    </v-card>
      <v-btn
        color="primary"
        @click="e6 = 4"
      >
        Continue
      </v-btn>
      <v-btn text @click="e6 = 2">
        Back
      </v-btn>
    </v-stepper-content>

    <v-stepper-step step="4">
      Submit for review
    </v-stepper-step>
    <v-stepper-content step="4">
      <v-btn

        @click="submitLabel"
        color="success"
      >
        Submit
      </v-btn>
      <v-btn text @click="e6 = 3">
        Back
      </v-btn>
    </v-stepper-content>
  </v-stepper>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-text class ="body-1">
          <br>
          Label for dataset {{ selectedName }} Submitted successfully
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn  text color="green darken-1" @click="closeDialog">Home page</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
    export default {
  components: {
    Logo: () => import('@/components/Logo'),
  },
  data() {
    return {
      dialog: false,
      e6: 1,
      fileData: null,
      titles: [],
      artifact_ids: [],
      selectedName: '',
      selectedFile: '',
      labelLink: '',
      labelType: '',
      errorMessage1: '',
      errorMessage2: '',
      dialog: false,
      nameToID: {},
        types: ['presentation', 'publication', 'dag', 'argus', 'pcap',  'netflow', 'flowtools', 'flowride', 'fsdb', 'csv', 'custom'],
    }
  },
  computed: {
    ...mapState({
      artifacts: state => state.artifacts.artifacts.artifacts,
      artifact: state => state.artifacts.artifact.artifact,
      pages: state => state.artifacts.artifacts.pages,
      total: state => state.artifacts.artifacts.total,
      search_init: state => state.artifacts.search,
    })

  },
  async created() {
    if (!this.$auth.loggedIn){
      this.$router.push('/login')
    }
    let payload = {
          keywords: "",
          page: this.page,
          items_per_page: this.limit,
          type: this.types
        }
        await this.$store.dispatch('artifacts/fetchArtifacts', payload)
        for (let i of this.artifacts){
          this.titles.push(i.title)
          this.artifact_ids.push(i.id)
          this.nameToID[i.title] =i.id
        }
        console.log(this.artifacts[0])
        console.log(this.titles)
  },
  mounted() {

    console.log(this.artifacts[0])

  },
  methods: {
      onAddFiles(){
        this.e6 = 3

    },
    validateDataset(){
      if(this.selectedName == ''){
        this.errorMessage1 = "Please select a label before proceding forward"
        return
      }
      else{
        this.errorMessage1 = ''
        this.e6 = 2
      }
    },
    validateUrl(value){
      return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
    },
    validateLinkId(){
      if (this.labelType == ''){
        this.errorMessage2 = "Please enter a label Id"
        return
      }
      if(!this.validateUrl(this.labelLink)){
        this.errorMessage2 ="Please enter a valid URL"
        return
      }
      if(this.labelLink == ''){
        this.errorMessage2 = "The URL cannot be blank"
        return
      }
      this.errorMessage2 = ''
      this.e6 =3

    },
    async submitLabel(){
      let payload = {}
      payload["label_id"] = this.labelType
      payload["artifact_id"] = this.nameToID[this.selectedName]
      payload["label_url"] = this.labelLink
      let response = await this.$labelEndpoint.post(this.nameToID[this.selectedName],payload)
      console.log(response)
      if (response.status == 200){
        this.dialog = true
      }
    },
    closeDialog(){
      console.log("iN close")
      this.dialog = false
      this.$router.push('/')

    }
  },

}
</script>

