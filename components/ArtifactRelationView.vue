<template>
  <div>
    <v-card elevation="0">
      <v-card-text class="pb-0">
        <v-row class="d-flex align-center">
          <v-col class="pb-0 pb-md-3" cols="12" md="3">
            <v-select
              v-model="displayMode"
              :items="availableModes"
              label="Relation Direction"
              outlined dense
            ></v-select>
          </v-col>
          <v-col class="pt-0 pt-md-3" cols="12" md="9">
            <v-select
              v-model="filters"
              :items="availableFilters"
              label="Relation Type"
              outlined dense multiple
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-list dense>
      <v-list-item v-for="relation, idx in relations"
        :key="`${relation.artifact_id}-${idx}`">
        <v-row>
          <v-col cols="12" md="2" class="text-md-right pt-4 pb-0 mb-n3 grey--text text--darken-2">
            <v-list-item-title>{{ relation.relation | titlecase }}</v-list-item-title>
          </v-col>
          <v-col cols="12" md="10" class="pt-0">
            <v-list-item-content>
              <v-list-item-title>
                <v-btn v-if="edit" class="mb-1" fab x-small text
                  @click="deleteRelationship(relation)">
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
                <span v-if="relation.related_artifact_group.publication !== null">
                  {{ relation.related_artifact_group.publication.artifact.title }}
                </span>
                <span v-else class="red--text text--lighten-1">
                  [Related artifact not yet published -- no title available!]
                </span>
                <v-btn class="mb-1" fab x-small text
                  :href="getSearcchLinkForArtifact(relation)">
                  <v-icon small>mdi-open-in-new</v-icon>
                </v-btn>
              </v-list-item-title>
              <p
                v-if="relation.related_artifact_group.publication !== null"
                class="text-caption"
              >
                {{ relation.related_artifact_group.publication.artifact.description }}
              </p>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { reverseRelation } from '@/helpers'

export default {
  components: {
    SingleComment: () => import('@/components/SingleComment'),
    ArtifactChips: () => import('@/components/ArtifactChips')
  },
  props: {
    artifact_group: {
      type: Object,
      required: true
    },
    edit: {
      type: Boolean,
      requred: false,
      default: false,
    }
  },
  data() {
    return {
      displayMode: 'Forward & Backward',
      filters: ['cites','supplements','extends','uses','describes','requires','processes','produces'],
      availableModes: ['Forward & Backward', 'Forward', 'Backward'],
      availableFilters: ['cites','supplements','extends','uses','describes','requires','processes','produces']
    }
  },
  computed: {
    relations() {
      let results = []
      const showReversedRelation = typeof this.artifact_group.reverse_relationships !== 'undefined'
        && this.artifact_group.reverse_relationships.length && this.displayMode !== 'Forward'
      const showPositiveRelation = typeof this.artifact_group.relationships !== 'undefined'
        && this.artifact_group.relationships.length && this.displayMode !== 'Backward'
      
      if (showPositiveRelation) {
        results.push(...this.artifact_group.relationships.filter(v => this.filters.includes(v.relation)))
      }


      if (showReversedRelation) {
        results.push(...this.artifact_group.reverse_relationships
          .filter(v => this.filters.includes(v.relation))
          .map(e => ({ ...e, relation: reverseRelation(e.relation)}))
        )
      }

      return results
    },
  },
  methods: {
    getSearcchLinkForArtifact(relation) {
      return "/artifact/" + relation.related_artifact_group_id
    },
    deleteRelationship(relation) {
      const idx = this.artifact_group.relationships.indexOf(relation)
      console.log(relation)
      this.deleteRelationshipApi(relation.id)
      this.artifact_group.relationships.splice(idx, 1)
    },
    async deleteRelationshipApi(id) {
      let response = await this.$relationshipEndpoint.delete(id)
    }
  }
}
</script>
