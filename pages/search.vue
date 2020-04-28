<template>
  <v-layout>
    <v-flex class="text-center">
      <img src="/images/horiz-tagline.png" alt="SEARCCH Portal" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;Collaborate&#8221;
        <footer>
          <small>
            <em>&mdash;SEARCCH Team</em>
          </small>
        </footer>
      </blockquote>

      <v-card
        v-for="item in items"
        max-width="344"
        class="mx-auto elevation-2"
        :key="item.id"
      >
        <v-card-text>
          {{ item.title }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon :to="`/artifact/${item.id}`" nuxt>
            <v-icon>mdi-card-search</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },
  mounted() {
    this.$axios
      .get(process.env.ZENODO_API_URL + 'records/', {
        params: {
          q: 'cyber',
          size: '20'
        }
      })
      .then(response => {
        this.items = response.data
      })
  },
  methods: {
    async asyncData({ $axios }) {
      let queryResult = await $axios.$get(
        'https://zenodo.org/api/records/?q=cyber'
      )
      return { items: queryResult }
    }
  }
}
</script>
