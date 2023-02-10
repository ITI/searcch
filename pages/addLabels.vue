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
        </v-card-text>
      </v-card>
      <v-btn
        color="primary"
        @click="e6 = 2"
      >
        Continue
      </v-btn>
     
    </v-stepper-content>

    <v-stepper-step
      :complete="e6 > 2"
      step="2"
    >
      Upload a file with labels 
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-card
        color=""
        class="mb-12"
        height="400px"
      >
         <v-card-title>Upload a file in the box below</v-card-title>
        <v-card-text>
          Please upload a text file with your labels (gzipped is OK). Please use the following format within the file:<br/><br/>
          <v-card width="170">
          <v-chip
      class="ma-2"
      label
    >
      recordID 
    </v-chip>
          <v-chip
      class="ma-2"
      label
    >
      label
    </v-chip>
          </v-card>
          <br/>
          Where record id looks like:<br/>
           
          <v-card width = 340>
            <v-chip
      class="ma-2"
      label
    >
      timestamp-sourceIP-sourceport-destIP-destport
    </v-chip>
          </v-card><br/>
        and label can be the label of your choice, e.g., “legitimate” vs “attack”<br/> <br/>
          <v-file-input
    label="Select file"
    outlined
    dense
    accept=".txt"
    v-model = "selectedFile"
  ></v-file-input>
        </v-card-text>
      </v-card>
      <v-btn
        color="primary"
        @click="onAddFiles"
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
        height="200px"
      >
      {{ selectedName }} <br/>
      
      {{ fileData }}
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
  
        @click=""
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
      states: [
          'Alabama',
          'Alaska',
          'American Samoa',
          'Arizona',
          'Arkansas',
          'California',
          'Colorado',
          'Connecticut',
          'Delaware',
          'District of Columbia',
          'Federated States of Micronesia',
          'Florida',
          'Georgia',
          'Guam',
          'Hawaii',
          'Idaho',
          'Illinois',
          'Indiana',
          'Iowa',
          'Kansas',
          'Kentucky',
          'Louisiana',
        ],
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
        var reader = new FileReader();
        reader.readAsText(this.selectedFile);
        reader.onload = () => {
        this.fileData = reader.result;
      }
    }
  }
}
</script>
  
