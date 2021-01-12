<template>
<span>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
        <div class="text-center">
        <logo />
        </div>
        
    </v-flex>
  </v-layout>
  <v-layout column justify-left align-top>
    <h1>Import</h1>
    <v-divider></v-divider><br>
    <v-form>
      <v-row align="center">
        <v-col cols="10">
          <v-text-field
              label="URL"
              placeholder="http://github.com/MyProject"
              outlined
              hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn
              class="primary"
              :disabled="importing"
              @click="startImport()"
              block
          >Start Import</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <br><v-divider></v-divider><br>
    <ImportList :imports="imports"></ImportList>
  </v-layout>
</span>
</template>

<script>
import ImportList from '~/components/ImportList'
import Logo from '~/components/Logo.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Logo,
    ImportList
  },
  data() {
    return {
      importing: false,
    }
  },
  async mounted () {
    this.$store.dispatch('artifacts/fetchImports', { userid: this.user_id })
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      imports: state => state.artifacts.imports,
    }),
  },
  methods: {
    startImport () {
        this.importing = true
    }
  },
}
</script>