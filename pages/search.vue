<template>
  <v-container fluid>
    <v-flex class="text-center">
      <img src="/images/horiz-tagline.png" alt="SEARCCH Portal" class="mb-5" />
    </v-flex>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page="page"
      :search="search"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar class="mb-1">
          <v-text-field
            v-model="search"
            clearable
            flat
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title> Artifact {{ item.id }} </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                {{ item.title }}
              </v-card-text>
              <v-btn icon :to="`/artifact/${item.id}`" nuxt>
                <v-icon>mdi-card-search</v-icon>
              </v-btn>
              <v-btn icon :to="`/artifact/${item.id}`" nuxt>
                <v-icon>mdi-star-outline</v-icon>
              </v-btn>
              <v-btn icon :to="`/artifact/${item.id}`" nuxt>
                <v-icon>mdi-comment</v-icon>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text class="ml-2" v-on="on">
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span
            class="mr-4
            grey--text"
          >
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn fab dark class="mr-1" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab dark class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
export default {
  head() {
    return {
      title: 'SEARCH Artifact Search',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Portal Artifact Search Results'
        }
      ]
    }
  },
  data() {
    return {
      items: [],
      itemsPerPageArray: [8, 16, 24],
      search: '',
      page: 1,
      itemsPerPage: 8
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
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    }
  }
}
</script>
