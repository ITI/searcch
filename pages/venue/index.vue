<template>
  <div>
    <v-card elevation="0" class="pb-8">
      <v-img
        class="white--text align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="40vh"
      >
        <v-row>
          <v-col cols="auto">
            <v-img
              class="white--text align-end mb-4 ml-4"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              style="{ position: absolute; bottom: 0px; right: 0px }"
              height="128px"
              width="128px"
            >
            </v-img>
          </v-col>
          <v-col sm="9" md="5">
            <v-card-title class="pl-0">
              <v-badge content="Verified" color="secondary">
                <a :href="venue.url" target="_blank" rel="noopener noreferrer">
                  {{venue.title | titlecase}}({{venue.abbrev}})
                </a>
              </v-badge>
            </v-card-title>
            <v-card-subtitle class="pl-0 pb-2">
              <span class="mr-4">
                <v-icon color="white" small class="pb-1">mdi-map-marker-outline</v-icon>
                <i>{{ venue.location }}</i>
              </span>
              <span class="mr-4">
                <v-icon color="white" small class="pb-1">mdi-account-group</v-icon>
                <a :href="venue.publisher_url" target="_blank">
                  <i>{{ venue.publisher }}</i>
                </a>
              </span>
            </v-card-subtitle>
            <v-card-text class="pl-0">
              {{ venue.description }}
            </v-card-text>
          </v-col>
        </v-row>
      </v-img>
    </v-card>
    <SearchCard/>
  </div>
</template>

<script>
// type Venue = {
//   type: 'conference' | 'journal' | 'magazine' | 'newspaper' | 'periodical' | 'event' | 'other',
//   title: String,
//   abbrev: String,
//   url: String,
//   description: String,
//   location: String,
//   year: Number,
//   month: Number,
//   start_day: Number,
//   end_day: Number,
//   publisher: String,
//   publisher_location: String,
//   publisher_url: String,
//   isbn?: String,
//   issn?: String,
//   doi?: String,
//   volume?: Number,
//   issue?: Number,
//   verified: Boolean,
// }

const venue = {
  type: 'conference',
  title: 'Example conference',
  abbrev: 'EC',
  url: 'https://www.example.com',
  description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit quos incidunt numquam ab culpa optio alias.',
  location: 'London',
  year: 2022,
  month: 1,
  start_day: 1,
  end_day: 3,
  publisher: 'Example publisher',
  publisher_location: 'Publisher location',
  publisher_url: 'https://www.example.com/example-publisher',
  isbn: 'NA',
  issn: 'NA',
  doi: 'NA',
  volume: 3,
  issue: 1,
  verified: true
}

export default {
  components: { 
    SearchCard: () => import('~/components/SearchCard.vue')
  },
  // props: {
  //   venueProp: {
  //     type: Object,
  //     required: true
  //   }
  // },
  data() {
    return {
      venue
    }
  }
}
</script>


<style scoped>
a {
  text-decoration: none; 
  color: white;
}
</style>