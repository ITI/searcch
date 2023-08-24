<template>
  <div class="mt-4">
    <v-card elevation="0">
      <v-card-text class="pb-0">
        <v-row class="d-flex align-center">
          <v-col class="pb-0 pb-md-3" cols="12" md="3">
            <v-select
              v-model="displayMode"
              :items="availableModes"
              label="Relation Direction"
              variant="outlined" density="compact"
            ></v-select>
          </v-col>
          <v-col class="pt-0 pt-md-3" cols="12" md="9">
            <v-select
              v-model="filters"
              :items="availableFilters"
              label="Relation Type"
              variant="outlined" density="compact" multiple chips
            >
              <template v-slot:prepend-item>
                <v-list-item
                  title="Select All"
                  @click="toggleRelationTypes"
                >
                  <template v-slot:prepend>
                    <v-checkbox-btn
                      color="indigo-darken-4"
                      :indeterminate="filters.length > 0 && filters.length < availableFilters.length"
                      :model-value="filters.length === availableFilters.length"
                    ></v-checkbox-btn>
                  </template>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-sheet v-if="!relations.length" class="item-nothing-message">
      <v-row justify="center">
        <v-col cols="6">
          <v-card elevation="0">
            <v-card-text align="center">
              <p class="text-h4 text--primary">
                Oops...Nothing here : (
              </p>
              <div class="text--primary mt-4">
                We couldn't find any related artifacts with given criteria. Please adjust your filters and try again!
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
    <v-list v-else density="compact">
      <v-list-item v-for="relation, idx in relations"
        :key="`${relation.artifact_id}-${idx}`"
        class="item-artifact-relation">
        <v-row>
          <v-col cols="12" md="2" class="text-md-right pt-4 pb-0 mb-n3 text-grey-darken-2">
            <v-list-item-title>{{$filters.titlecase( relation.relation ) }}</v-list-item-title>
          </v-col>
          <v-col cols="12" md="10" class="pt-3">
            <p>
              <v-btn v-if="edit" class="mb-1 text-red" size="xs" variant="plain"
                @click="deleteRelationship(relation)" icon="mdi-trash-can">
              </v-btn>
              
              <span v-if="relation.related_artifact_group.publication !== null">
                {{ relation.related_artifact_group.publication.artifact.title }}
              </span>
              <span v-else class="text-red-lighten-1">
                [Related artifact not yet published -- no title available!]
              </span>
              <v-btn class="mb-1" size="x-small" variant="plain"
                :href="getSearcchLinkForArtifact(relation)"
                icon="mdi-open-in-new"
              ></v-btn>
            </p>
            <p
              v-if="relation.related_artifact_group.publication !== null"
              class="text-caption"
            >
              {{ relation.related_artifact_group.publication.artifact.description }}
            </p>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { reverseRelation } from '@/helpers'

export default defineComponent({
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
      filters: ['Cites','Supplements','Extends','Uses','Describes','Requires','Processes','Produces'],
      availableModes: ['Forward & Backward', 'Forward', 'Backward'],
      availableFilters: ['Cites','Supplements','Extends','Uses','Describes','Requires','Processes','Produces'],
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
        results.push(...this.artifact_group.relationships.filter(v => this.filters.map(e => e.toLowerCase()).includes(v.relation)))
      }


      if (showReversedRelation) {
        results.push(...this.artifact_group.reverse_relationships
          .filter(v => this.filters.map(e => e.toLowerCase()).includes(v.relation))
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
      this.deleteRelationshipApi(relation.id)
      this.artifact_group.relationships.splice(idx, 1)
    },
    async deleteRelationshipApi(id) {
      let response = await this.$relationshipEndpoint.delete(id)
    },
    toggleRelationTypes() {
      this.$nextTick(() => {
        if (this.filters.length === this.availableFilters.length) {
          this.filters = []
        } else {
          this.filters = this.availableFilters.slice()
        }
      })
    },
  }
});
</script>
