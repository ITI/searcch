<template>
  <div>
    <router-link to="/search">Back</router-link>
    <ArtifactShort
      v-if="source === 'zenodo' && artifact.metadata"
      :id="artifact.id"
      :title="artifact.title"
      :description="artifact.metadata.description"
      :source="source"
      :comments="comments"
    ></ArtifactShort>
    <ArtifactShort
      v-if="source === 'kg'"
      :id="artifact.id"
      :title="artifact.title"
      :description="artifact.description"
      :source="source"
      :score="artifact.relevance_score"
      :comments="comments"
    ></ArtifactShort>
  </div>
</template>

<script>
import ArtifactShort from '~/components/ArtifactShort'

import { mapState } from 'vuex'

export default {
  components: {
    ArtifactShort
  },
  head() {
    return {
      title: this.artifact.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.artifact.title
        }
      ]
    }
  },
  data() {
    return {
      comments: [
        {
          title: 'Comment 1',
          person: 'John Doe',
          posted: '1st Jan 2020',
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!'
        },
        {
          title: 'Another Comment',
          person: 'Jane Doe',
          posted: '10th Jan 2020',
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!'
        },
        {
          title: 'More Comments',
          person: 'Charlie Doe',
          posted: '20th Feb 2020',
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!'
        },
        {
          title: 'Yet another comment',
          person: 'Abigail Doe',
          posted: '20th Mar 2020',
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      artifact: state => state.artifacts.artifact,
      source: state => state.artifacts.source
    })
  },
  mounted() {
    if (typeof this.$route.query.source !== 'undefined' && this.source === '') {
      this.$store.commit('artifacts/SET_SOURCE', this.$route.query.source)
    }
    if (this.source === 'zenodo' || this.$route.query.source === 'zenodo') {
      this.$axios.setToken(this.$store.state.ZENODO_API_KEY, 'Bearer', [
        'post',
        'delete'
      ])
    }
    this.$store.dispatch('artifacts/fetchArtifact', {
      id: this.source === 'kg' ? this.$route.query.doi : this.$route.params.id,
      source: this.$route.query.source ? this.$route.query.source : this.source
    })
  }
}
</script>
