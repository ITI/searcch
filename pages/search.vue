<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col sm="12" md="10" lg="6">
        <div class="text-center">
          <logo />
        </div>
      </v-col>
    </v-row>
    <v-row justify="start" align="start">
      <v-col cols="12">
        <h1>
          Search
          <v-dialog transition="dialog-bottom-transition" max-width="600">
            <template v-slot:activator="{ props }">
              <v-btn class="bg-primary mb-2" size="x-small" v-bind="props" icon="mdi-help" />
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="primary" theme="dark">Search Help</v-toolbar>
                <v-card-text>
                  <div class="text-h6 pa-12">
                    <p>
                      To search for artifacts in the hub, 
                      enter your search terms in the search dialog box at the top of the form
                      and click on the SEARCH button.
                    </p>
                    <p>
                      The hub searches subjects, descriptions, and keywords by default and returns matches.
                      You may search by author and organization by clicking on the Advanced button.
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
                  <v-btn variant="text" @click="dialog.value = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </h1>
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12">
        <SearchCard />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    Logo: defineAsyncComponent(() => import('@/components/Logo')),
    SearchCard: defineAsyncComponent(() => import('@/components/SearchCard'))
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
});
</script>
