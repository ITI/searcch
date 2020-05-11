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
    <ArtifactList :artifacts="artifacts"></ArtifactList>
  </div>
</template>

<script>
import ArtifactList from '~/components/ArtifactList'

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
      artifacts: [],
      search: ''
    }
  },
  components: {
    ArtifactList
  },
  async asyncData(ctx) {
    return {
      artifacts: await ctx.app.$zenodoRecordRepository.index({
        q: 'cyber',
        size: '20'
      })
    }
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault()
      this.artifacts = await this.$zenodoRecordRepository.index({
        q: this.search,
        size: '20'
      })
    }
  }
}
</script>
