<template>
  <div>
    <v-card class="mx-auto overflow-hidden" elevation="3">
      <v-container>
        <v-row>
          <v-col cols="9">
            <v-card-title class="align-start">
              <span class="headline">{{$filters.titlecase( artifact.title ) }}</span> 
            </v-card-title>
          </v-col>
          <v-col cols="3">
            <ArtifactChips
              class="card-chip"
              :field="[artifact.type]"
              :type="artifact.type"
            ></ArtifactChips>
          </v-col>
        </v-row>
      </v-container>
      <span class="ml-4 grey--text text--darken-2 font-weight-light caption">
        {{ artifact.num_reviews }}
        {{ artifact.num_reviews == 1 ? 'review' : 'reviews' }}
      </span>
      <v-rating
        v-model="artifact.avg_rating"
        color="amber"
        dense
        half-increments
        readonly
        size="18"
        class="ml-3"
      ></v-rating>

      <v-card-text v-html="sanitizedDescription"> </v-card-text>

      <div v-if="comments">
        <v-row justify="center">
          <v-expansion-panels inset multiple focusable v-model="expanded">
            <v-expansion-panel v-for="(comment, i) in comments" :key="i">
              <v-expansion-panel-title disable-icon-rotate>
                <template v-slot:actions>
                  <v-icon color="primary">mdi-comment</v-icon>
                </template>
                {{ comment.person }} -- {{ comment.title }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-rating
                  v-model="comment.rating"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="18"
                ></v-rating>

                {{ comment.content }}
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </div>

      <v-card-actions>
        <v-btn
          icon
          @click="favoriteThis()"
          :color="favorite == true ? 'red' : ''"
        >
          <v-icon>{{ favorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>

        <v-btn
          icon
          v-if="!related"
          :to="`/artifact/review/${artifact.artifact_group_id}`"
          nuxt
        >
          <v-icon>mdi-comment</v-icon>
        </v-btn>
        <span style="padding: 0 5 0 5; font-weight bold;" v-if="contributionTypeText"> | </span>
        <v-chip
          class="ma-2"
          cols="12"
          label
          :color="getContributionChipColor()"
          v-if="contributionTypeText">
          <v-avatar left>
            <v-icon>mdi-check-circle</v-icon>
          </v-avatar>
          <span style="font-weight: normal;">{{ contributionTypeText }}</span>
        </v-chip>

        <v-spacer></v-spacer>
        <v-select
          v-if="related"
          label="Relationship Type"
          :items="relations"
          v-model="relation"
        ></v-select>
        <v-btn
          v-if="!related"
          color="primary"
          :to="getArtifactLink()"
          nuxt
        >
          Read More
        </v-btn>
        <v-btn
          v-else
          color="success"
          @click="addRelated(artifact.artifact_group_id, relation)"
          :disabled="relation.length == 0"
        >
          Add Related
        </v-btn>
        <v-btn
          v-if="isOwner() || isAdmin()"
          color="success"
          :to="`/artifact/${artifact.artifact_group_id}/${artifact.id}?edit_relation=true`"
          nuxt
        >
          Edit Relation
        </v-btn>
        <v-btn
          v-if="isOwner() || isAdmin()"
          color="success"
          :to="`/artifact/${artifact.artifact_group_id}/${artifact.id}?edit=true`"
          nuxt
        >
          Edit
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import clip from 'text-clipper'
import { mapState } from 'pinia'
import { EventBus } from '@/helpers'
import { userStore } from '~/stores/user'
import { artifactsStore } from '~/stores/artifacts'

export default defineComponent({
  props: {
    artifact: {
      type: Object,
      required: true
    },
    comments: {
      type: Array,
      required: false
    },
    related: {
      type: Boolean,
      required: false
    }
  },
  components: {
    ArtifactChips: defineAsyncComponent(() => import('@/components/ArtifactChips'))
  },
  data() {
    return {
      expanded: this.comments
        ? Array(this.comments.length)
            .fill(1)
            .map(Number.call, Number)
        : [],
      relations: [
        'cites',
        'supplements',
        'extends',
        'uses',
        'describes',
        'requires',
        'processes',
        'produces'
      ],
      relation: ''
    }
  },
  computed: {
    ...mapState(userStore, ['userid', 'user_is_admin']),
    ...mapState(artifactsStore, {
      favorites: 'favoritesIDs',
    }),
    sanitizedDescription: function() {
      let description = ''
      description = this.artifact.description
      return clip(this.$sanitize(description), 2000, {
        html: true,
        maxLines: 40
      })
    },
    favorite: {
      get() {
        return this.favorites[this.artifact.artifact_group_id] ? true : false
      },
      set(value) {
        value
        ? this.$artifactsStore.addFavorite(this.artifact.artifact_group_id)
        : this.$artifactsStore.removeFavorite(this.artifact.artifact_group_id)
      }
    },
    contributionTypeText() {
      if (this.artifact === undefined) {
        return false;
      }
      if (this.artifact.artifact_group.owner_id == this.userid) {
        return 'owner';
      }
      if(this.artifact.owner.id != this.userid) {
        return false;
      }
      let isDraft = this.artifact.artifact_group.publications ? true : false;
      this.artifact.artifact_group.publications && this.artifact.artifact_group.publications.forEach(publication => {
        if (publication.artifact_id == this.artifact.id) {
          isDraft = false;
        }
      });
      if (isDraft) {
        return 'draft';
      }
      return 'contributor';
    }
  },
  methods: {
    async favoriteThis() {
      if (!this.$auth.loggedIn) {
        navigateTo('/login')
      } else {
        let action = !this.favorite
        this.favorite = !this.favorite
        if (action) {
          // FIXME: backend API
          await this.$favoritesEndpoint.post(this.artifact.artifact_group_id, {})
        } else {
          await this.$favoritesEndpoint.delete(this.artifact.artifact_group_id)
        }
      }
    },
    getArtifactLink() {
      if(this.artifact === undefined) {
        return;
      }
      if (this.artifact.artifact_group !== undefined
          && this.artifact.artifact_group.publication !== undefined
          && this.artifact.artifact_group.publication !== null
          && this.artifact.artifact_group.publication.artifact_id == this.artifact.id) {
        return `/artifact/${this.artifact.artifact_group_id}`;
      } else {
        return `/artifact/${this.artifact.artifact_group_id}/${this.artifact.id}`;
      }
    },
    addRelated(id, relation) {
      console.log(this.artifact)
      this.$artifactsStore.setRelated({
        id: id,
        relation: relation
      })
      EventBus.$emit('close', 'artifactdialog')
    },
    isAdmin() {
      this.user_is_admin
    },
    isOwner() {
      return typeof this.artifact.owner !== 'undefined'
        ? this.artifact.artifact_group.owner_id == this.userid
        : false
    },
    getContributionChipColor() {
      switch(this.contributionTypeText) {
        case 'owner':
          return 'green white--text';
        case 'contributor':
          return 'blue white--text';
        case 'draft':
          return 'orange white--text';
        default:
          return 'grey';
      }
    }
  }
});
</script>

<style scoped>
.card-chip {
  position: absolute;
  top: 0px;
  right: 0px;
}

.v-card__title {
  word-break: normal;
}

.headline {
  align-self: center;
}
</style>
