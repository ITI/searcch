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
          density="compact"
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
        density="compact"
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
    <v-card-actions
      v-if="userid == comment.review.reviewer.id"
      class="justify-end"
    >
      <v-btn color="success" @click="editing = true" v-if="!editing">
        Edit
      </v-btn>
      <v-btn
        color="success"
        @click="saveReview()"
        disable="this.review == ''"
        v-if="editing"
      >
        Save
      </v-btn>
      <v-btn color="error" @click="deleteReview()" v-if="!editing">
        Delete
      </v-btn>
      <v-btn variant="text" color="error" @click="editing = false" v-if="editing">
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-else>Loading...</v-card>
</template>
<script>
import { mapState } from 'pinia'
import { userStore } from '~/stores/user'

export default defineComponent({
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
    ...mapState(userStore, {
      userid: state => state.userid,
      username: state => state.username
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
        rating: this.rating_local
      }

      await this.$ratingsEndpoint.update(this.$route.params.id, rating_payload)
      let comment_payload = {
        review: this.review_local,
        reviewid: this.id
      }
      // FIXME: backend API
      await this.$reviewsEndpoint.post(this.$route.params.id, comment_payload)
      this.$artifactsStore.fetchArtifact( {
        artifact_group_id: this.$route.params.id
      })
    },
    async deleteReview() {
      if (!confirm('Are you sure you want to delete this review?')) return
      await this.$ratingsEndpoint.delete(this.$route.params.id)
      let comment_payload = {
        reviewid: this.id
      }
      await this.$reviewsEndpoint.remove(this.$route.params.id, comment_payload)
      this.$artifactsStore.fetchArtifact( {
        artifact_group_id: this.$route.params.id
      })
    }
  }
});
</script>
<style scoped>
pre {
  font: inherit;
}
</style>
