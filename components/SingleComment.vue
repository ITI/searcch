<template>
  <v-card v-if="comment">
    <v-card-title>
      <v-row class="ml-1">
        <span v-if="name != ''">{{ name }}</span
        ><span v-else>Anonymous</span>
        <v-rating
          v-model="rating"
          v-if="!editing"
          color="amber"
          dense
          readonly
          size="18"
          class="ml-3"
        ></v-rating>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-rating
        v-model="rating_local"
        v-if="editing"
        label="Rating"
        color="amber"
        dense
        hover
        size="24"
        class="ml-3"
      ></v-rating>
      <pre v-if="!editing">{{ review }}</pre>
      <v-textarea
        v-else
        label="Review"
        placeholder="Add review..."
        v-model="review_local"
      >
      </v-textarea>
    </v-card-text>
    <v-card-actions v-if="userid == comment.review.reviewer.id">
      <v-btn text color="primary" @click="editing = true" v-if="!editing">
        Edit
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="saveReview()"
        disable="this.review == ''"
        v-if="editing"
      >
        Save
      </v-btn>
      <v-btn text color="primary" @click="deleteReview()" v-if="!editing">
        Delete
      </v-btn>
      <v-btn text color="primary" @click="editing = false" v-if="editing">
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-else>Loading...</v-card>
</template>
<script>
import { mapState } from 'vuex'

export default {
  components: {
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false,
      review_local: this.review,
      rating_local: this.rating
    }
  },
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      username: state => state.user.username
    }),
    name() {
      return this.comment.review.reviewer.person.name
    },
    id() {
      return this.comment.review.id
    },
    review() {
      this.review_local = this.comment.review.review
      return this.comment.review.review
    },
    rating() {
      this.rating_local = this.comment.rating.rating
      return this.comment.rating.rating
    }
  },
  methods: {
    async saveReview() {
      this.editing = false
      let rating_payload = {
        token: this.$auth.getToken('github'),
        userid: this.userid,
        rating: this.rating_local
      }
      await this.$ratingsEndpoint.put(this.$route.params.id, rating_payload)
      let comment_payload = {
        token: this.$auth.getToken('github'),
        userid: this.userid,
        review: this.review_local,
        reviewid: this.id
      }
      await this.$reviewsEndpoint.put(this.$route.params.id, comment_payload)
      this.$store.dispatch('artifacts/fetchArtifact', {
        id: this.$route.params.id
      })
    },
    async deleteReview() {
      if (!confirm('Are you sure you want to delete this review?')) return
      let rating_payload = {
        token: this.$auth.getToken('github'),
        userid: this.userid
      }
      await this.$ratingsEndpoint.remove(this.$route.params.id, rating_payload)
      let comment_payload = {
        token: this.$auth.getToken('github'),
        reviewid: this.id,
        userid: this.userid
      }
      await this.$reviewsEndpoint.remove(this.$route.params.id, comment_payload)
      this.$store.dispatch('artifacts/fetchArtifact', {
        id: this.$route.params.id
      })
    }
  }
}
</script>
<style scoped>
pre {
  font: inherit;
}
</style>
