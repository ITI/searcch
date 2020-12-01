<template>
  <div>
    <router-link to="/search">Back</router-link>
    <ArtifactCommentView :artifact="artifact" :comments="comments"></ArtifactCommentView>

    <v-container v-if="$auth.loggedIn" fill-height fluid grid-list-xl>
      <v-row justify="center">
        <v-col cols="12">
          <material-card
            color="primary"
            title="Add Comment"
            text="Provide your input"
          >
            <v-form ref="comment" v-model="valid">
              <v-container class="py-0">
                <v-row>
                  <v-col class="mx-0">
                    <small>
                      Terrible
                    </small>
                    <small style="margin-left: 105px">
                      Great
                    </small>
                    <v-rating
                      v-model="rating"
                      color="amber"
                      dense
                      hover
                      size="32"
                    ></v-rating>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      label="Review"
                      placeholder="Add review..."
                      v-model="comment"
                    >
                    </v-textarea>
                  </v-col>
                  <v-col cols="12" class="text-right">
                    <v-btn color="success" @click="onSubmit" :disabled="!formCheck">
                      Add Review
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </material-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else fill-height fluid grid-list-xl>
      <v-row justify="center">
        <v-col cols="12">
          <material-card
            color="primary"
            title="Log in to add a comment"
            nuxt to="/login"
          >
          </material-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ArtifactCommentView from '~/components/ArtifactCommentView'

import { mapState } from 'vuex'

export default {
  components: {
    ArtifactCommentView
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
      valid: true,
      comment: '',
      rating: 0
    }
  },
  computed: {
    ...mapState({
      artifact: state => state.artifacts.artifact,
      source: state => state.artifacts.source,
      comments: state => state.artifacts.artifact.reviews,
      user_id: state => state.user.user_id,
    }),
    formCheck() {
      if (this.rating == 0 && this.comment == '') return false
      return true
    }
  },
  methods: {
    async onSubmit() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        if (this.rating) {
          let rating_payload = {
            api_key: process.env.KG_API_KEY,
            token: this.$auth.getToken('github'),
            userid: this.user_id,
            rating: this.rating
          }
          await this.$ratingsEndpoint.put(this.artifact.artifact.id, rating_payload)
        }
        if (this.comment) {
          let comment_payload = {
            review: this.comment,
            api_key: process.env.KG_API_KEY,
            token: this.$auth.getToken('github'),
            userid: this.user_id
          }
          await this.$reviewsEndpoint.update(this.artifact.artifact.id, comment_payload)
        }
        if (this.comment || this.rating) {
          this.$store.dispatch('artifacts/fetchArtifact', {
            id: this.$route.params.id,
            source: 'kg'
          })
        }
        this.$refs.comment.reset()
        this.rating = 0
      }
    }
  },
  mounted() {
    if (this.source === '') {
      this.$store.commit('artifacts/SET_SOURCE', 'kg')
    }
    if (typeof this.$route.query.source !== 'undefined') {
      this.$store.commit('artifacts/SET_SOURCE', this.$route.query.source)
    }
    this.$store.dispatch('artifacts/fetchArtifact', {
      id: this.$route.params.id,
      source: 'kg'
    })
  }
}
</script>
