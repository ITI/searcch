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
                    <v-input :error-messages="ratingCheck"> </v-input>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Title"
                      placeholder="Title"
                      v-model="title"
                      :rules="[v => !!v || 'Required']"
                      required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      label="Comment"
                      placeholder="Add comment..."
                      v-model="comment"
                      :rules="[v => !!v || 'Required']"
                      required
                    >
                    </v-textarea>
                  </v-col>
                  <v-col cols="12" class="text-right">
                    <v-btn color="success" @click="onSubmit" :disabled="!valid">
                      Add Comment
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
      title: '',
      rating: 0
    }
  },
  computed: {
    ...mapState({
      artifact: state => state.artifacts.artifact,
      source: state => state.artifacts.source,
      comments: state => state.artifacts.artifact.reviews
    }),
    ratingCheck() {
      return this.rating !== 0 ? '' : 'Required'
    }
  },
  methods: {
    onSubmit() {
      if (this.rating == 0) {
        return false
      } else {
        this.comments.push({
          title: this.title,
          person: 'Joe Admin',
          posted: '20th May 2020',
          content: this.comment,
          rating: this.rating
        })
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
