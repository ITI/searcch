<template>
    <v-card v-if="comment">
        <v-card-text>
            <pre v-if="!editing">{{ review }}</pre>
            <v-textarea
                v-else
                label="Review"
                placeholder="Add review..."
                v-model="review"
            >
            </v-textarea>
        </v-card-text>
        <v-card-actions v-if="user_id == comment.reviewer.id">
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
      review: this.comment.review,
      id: this.comment.id,
    }
  },
  computed: {
      ...mapState({
      user_id: state => state.user.user_id,
    }),
  },
  methods: {
      async saveReview () {
        this.editing = false
        let comment_payload = {
            api_key: process.env.KG_API_KEY,
            token: this.$auth.getToken('github'),
            userid: this.user_id,
            reviewid: this.id,
            review: this.review
        }
        await this.$reviewsEndpoint.put(this.$route.params.id, comment_payload)
        this.$store.dispatch('artifacts/fetchArtifact', {
            id: this.$route.params.id,
            source: 'kg'
        })
      },
      async deleteReview () {
        let rating_payload = {
            api_key: process.env.KG_API_KEY,
            token: this.$auth.getToken('github'),
            userid: this.user_id
        }
        await this.$ratingsEndpoint.remove(this.$route.params.id, rating_payload)
        let comment_payload = {
            api_key: process.env.KG_API_KEY,
            token: this.$auth.getToken('github'),
            userid: this.user_id,
            reviewid: this.id
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