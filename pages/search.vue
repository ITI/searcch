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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Fermentum dui faucibus in ornare quam. Laoreet id donec
                  ultrices tincidunt arcu non sodales neque. Tincidunt augue
                  interdum velit euismod in pellentesque massa placerat duis.
                  Maecenas volutpat blandit aliquam etiam erat velit scelerisque
                  in. Elit eget gravida cum sociis natoque. Volutpat commodo sed
                  egestas egestas fringilla phasellus faucibus scelerisque
                  eleifend. Ipsum faucibus vitae aliquet nec ullamcorper sit.
                  Nulla facilisi cras fermentum odio eu. Purus in mollis nunc
                  sed id semper risus in hendrerit. Velit dignissim sodales ut
                  eu. Morbi tristique senectus et netus et malesuada fames ac.
                  Orci sagittis eu volutpat odio facilisis mauris sit amet
                  massa.
                </p>
                <p>
                  Dignissim cras tincidunt lobortis feugiat vivamus at augue
                  eget. Adipiscing diam donec adipiscing tristique risus nec
                  feugiat in. Quis blandit turpis cursus in hac habitasse
                  platea. Integer quis auctor elit sed. Quam quisque id diam
                  vel. Mollis aliquam ut porttitor leo a diam sollicitudin. Id
                  velit ut tortor pretium viverra suspendisse potenti nullam ac.
                  Mauris pellentesque pulvinar pellentesque habitant morbi
                  tristique senectus et. Quis eleifend quam adipiscing vitae
                  proin sagittis. Posuere morbi leo urna molestie at elementum
                  eu facilisis. Orci a scelerisque purus semper eget.
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
