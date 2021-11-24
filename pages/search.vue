<template>
  <div>
    <div class="text-center">
      <logo />
    </div>
    <h1>
      Search
      <v-dialog transition="dialog-bottom-transition" max-width="600">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="primary ml-4" fab small v-bind="attrs" v-on="on"
            ><v-icon>mdi-help</v-icon></v-btn
          >
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="primary" dark>Search Help</v-toolbar>
            <v-card-text>
              <div class="text-h6 pa-12">
                <p>
                   To search for artifacts in the hub, 
                   enter your search terms in the search dialog box at the top of the form
                   and click on the SEARCH button.
                </p>
                <p>
                   The hub searches subjects, descriptions, and keywords and returns matches.
                   Please note that searching over author names is not yet implemented.
                </p>
                <p>
                   By default, only data and code artifact types are searched.
                   To search other artifact types, click on the datatype to expand the options.
                   Select the types you would like to search
                   and click on the SEARCH button.
                </p>
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </h1>
    <v-divider></v-divider><br />
    <SearchCard />
  </div>
</template>

<script>
export default {
  components: {
    Logo: () => import('@/components/Logo'),
    SearchCard: () => import('@/components/SearchCard')
  },
  head() {
    return {
      title: 'SEARCCH Artifact Search',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Hub Artifact Search Results'
        }
      ]
    }
  },
  data() {
    return {
      dialog: false
    }
  }
}
</script>
