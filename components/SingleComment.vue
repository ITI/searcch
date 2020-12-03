<template>
    <v-card v-if="comment">
        <v-card-text>
            <span v-if="!editing">{{ comment.review }}</span>
            <v-textarea
                v-else
                label="Review"
                placeholder="Add review..."
                v-model="comment.review"
            >
            </v-textarea>
        </v-card-text>
        <v-card-actions v-if="user_id == comment.reviewer.id">
            <v-btn
                text
                color="primary"
                @click="editReview(comment.id)"
                v-if="!editing"
            >
                Edit
            </v-btn>
            <v-btn
                text
                color="primary"
                @click="saveReview(comment.id)"
                v-if="editing"
            >
                Save
            </v-btn>
            <v-btn
                text
                color="primary"
                @click="deleteReview(comment.id)"
            >
                Delete
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
    }
  },
  computed: {
      ...mapState({
      user_id: state => state.user.user_id,
    }),
    review: {
      get () {
        return this.comment.review
      },
      set (value) {
        if (value) this.$store.commit('artifacts/ADD_FAVORITE', this.artifact.artifact.id)
        else this.$store.commit('artifacts/REMOVE_FAVORITE', this.artifact.artifact.id)
      }
    },
  },
  methods: {
      editReview (id) {
          this.editing = true
      },
      saveReview (id) {
          this.editing = false
      },
      deleteReview (id) {
          
      }
  }
}
</script>