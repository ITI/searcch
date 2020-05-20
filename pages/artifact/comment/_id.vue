<template>
  <div>
    <router-link to="/search">Back</router-link>
    <ArtifactShort :artifact="artifact" :comments="comments"></ArtifactShort>

    <v-container fill-height fluid grid-list-xl>
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
                      half-increments
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
          rating: 3.5,
          person: 'John Doe',
          posted: '1st Jan 2020',
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!'
        },
        {
          title: 'Another Comment',
          rating: 3.0,
          person: 'Jane Doe',
          posted: '10th Jan 2020',
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!'
        },
        {
          title: 'More Comments',
          rating: 4.5,
          person: 'Charlie Doe',
          posted: '20th Feb 2020',
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!'
        },
        {
          title: 'Yet another comment',
          rating: 2.5,
          person: 'Abigail Doe',
          posted: '20th Mar 2020',
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!'
        }
      ],
      valid: true,
      comment: '',
      title: '',
      rating: 0
    }
  },
  computed: {
    ...mapState({
      artifact: state => state.artifacts.artifact,
      source: state => state.artifacts.source
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
    if (this.source === 'zenodo' || this.$route.query.source === 'zenodo') {
      this.$axios.setToken(this.$store.state.app.ZENODO_API_KEY, 'Bearer', [
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
