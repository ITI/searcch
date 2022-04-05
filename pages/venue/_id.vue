<template>
  <v-card>
    <v-img
      :src="card.src"
      class="white--text align-end"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      height="200px"
    >
      <v-card-title>{{venue.title | titlecase}}</v-card-title>
    </v-img>
  </v-card>
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
  title: 'Example Conference',
  abbrev: 'EC',
  url: 'www.example.com',
  description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit quos incidunt numquam ab culpa optio alias, enim quidem fuga ex repellendus dolorum, dicta iure. Aspernatur doloremque laudantium nemo nihil officiis cum exercitationem temporibus iusto quis, dolore optio totam ipsum voluptatem?',
  location: 'London, Britain',
  year: 2022,
  month: 1,
  start_day: 1,
  end_day: 3,
  publisher: 'Example publisher',
  publisher_location: 'Publisher location',
  publisher_url: 'www.example.com/example-publisher',
  isbn: 'NA',
  issn: 'NA',
  doi: 'NA',
  volume: 3,
  issue: 1,
  verified: true
}

export default {
  props: {
    venueProp: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      venue
    }
  }
}
</script>


<style scoped>
.background {
  height: 30vh;
  color: grey;
}
</style>