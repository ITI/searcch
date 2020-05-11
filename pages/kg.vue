<template>
  <div>
    <v-flex class="text-center">
      <img src="/images/horiz-tagline.png" alt="SEARCCH Portal" class="mb-5" />
    </v-flex>

    <v-form ref="search" @submit="onSubmit">
      <v-text-field
        light
        solo
        append-icon="mdi-magnify"
        placeholder="Type keyword..."
        v-model="search"
        loading="true"
        clearable
      >
      </v-text-field>
    </v-form>

    <ArtifactList
      :artifacts="artifacts"
      :source="source"
      :limit="limit"
    ></ArtifactList>
  </div>
</template>

<script>
import ArtifactList from '~/components/ArtifactList'

// FIXME: remove test data import
import testdata from '~/static/kgtest.json'

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
      artifacts: testdata,
      search: '',
      source: 'kg',
      limit: 20
    }
  },
  components: {
    ArtifactList
  },
  async asyncData(ctx) {
    /* TODO: change to the appropriate initial query -- or don't query

    keyword queries:
      cybersecurity
      phishing
      denial of service
      botnet
      honeypot
      vulnerability
      ciphertext
      man in the middle attack

    */
    return {
      artifacts: await ctx.app.$knowledgeGraphSearchRepository.index({
        q: 'cybersecurity',
        size: '20'
      })
    }
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault()
      this.artifacts = await this.$knowledgeGraphSearchRepository.index({
        q: this.search,
        size: '20'
      })
    }
  }
}
</script>
