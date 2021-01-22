<template>
    <v-card v-if="comment">
        <v-card-title>
            <v-row class="ml-1">
                <span v-if="user_name != ''">{{ user_name }}</span><span v-else>Anonymous</span>
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
                v-model="rating"
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
                v-model="review"
            >
            </v-textarea>
        </v-card-text>
        <v-card-actions v-if="user_id == comment.review.reviewer.id">
            <v-btn
                text
                color="primary"
                @click="editing = true"
                v-if="!editing"
            >
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
            <v-btn
                text
                color="primary"
                @click="deleteReview()"
                v-if="!editing"
            >
                Delete
            </v-btn>
            <v-btn
                text
                color="primary"
                @click="editing = false"
                v-if="editing"
            >
                Cancel
            </v-btn>
        </v-card-actions>
    </v-card>
    <v-card v-else>Loading...</v-card>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      editing: false,
      review: this.comment.review.review,
      rating: this.comment.rating.rating,
      id: this.comment.review.id,

    }
  },
  computed: {
      ...mapState({
      user_id: state => state.user.user_id,
      user_name: state => state.user.username,
    }),
  },
  methods: {
      async saveReview () {
        this.editing = false
        let rating_payload = {
            token: this.$auth.getToken('github'),
            userid: this.user_id,
            rating: this.rating,
        }
        await this.$ratingsEndpoint.put(this.$route.params.id, rating_payload)
        let comment_payload = {
            token: this.$auth.getToken('github'),
            userid: this.user_id,
            review: this.review
        }
        await this.$reviewsEndpoint.put(this.$route.params.id, comment_payload)
        this.$store.dispatch('artifacts/fetchArtifact', {
            id: this.$route.params.id,
            source: 'kg'
        })
      },
      async deleteReview () {
        if (!confirm("Are you sure you want to delete this review?")) return
        let rating_payload = {
            token: this.$auth.getToken('github'),
            userid: this.user_id
        }
        await this.$ratingsEndpoint.remove(this.$route.params.id, rating_payload)
        let comment_payload = {
            token: this.$auth.getToken('github'),
            userid: this.user_id
        }
        await this.$reviewsEndpoint.remove(this.$route.params.id, comment_payload)
        this.$store.dispatch('artifacts/fetchArtifact', {
            id: this.$route.params.id,
            source: 'kg'
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