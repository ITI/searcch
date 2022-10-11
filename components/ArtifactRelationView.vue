<template>
  <v-tabs vertical>
    <v-tab v-for="relationName in Object.keys(relationsMap)" :key="`${relationName}-tab`">
      {{ relationName }}
    </v-tab>
    <v-tab-item v-for="relationName in Object.keys(relationsMap)" :key="`${relationName}-content`">
      <v-list-item v-for="relation, idx in relationsMap[relationName]"
        :key="`${relation.artifact_id}-${relationName}-${idx}`">
        <v-list-item-content>
          <v-list-item-title>
            <v-btn v-if="edit" class="mb-1" fab x-small text
              @click="deleteRelationship(relation)">
              <v-icon small>mdi-close</v-icon>
            </v-btn>
            {{ relation.related_artifact_group.publication.artifact.title }}
            <v-btn class="mb-1" fab x-small text
              :href="getSearcchLinkForArtifact(relation)">
              <v-icon small>mdi-open-in-new</v-icon>
            </v-btn>
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ relation.related_artifact_group.publication.artifact.description }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-tab-item>
  </v-tabs>
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
  computed: {
    relationsMap() {
      const hasReverseRelation = typeof this.artifact_group.reverse_relationships !== 'undefined'
        && this.artifact_group.reverse_relationships.length
      const hasRelation = typeof this.artifact_group.relationships !== 'undefined'
        && this.artifact_group.relationships.length
        
      if (!hasRelation && !hasReverseRelation) {
        return undefined
      }

      let dict = {}
      if (hasRelation) {
        this.artifact_group.relationships.forEach((relationItem, i) => {
          if (typeof dict[relationItem.relation] === 'undefined') {
            dict[relationItem.relation] = [relationItem]
          } else {
            dict[relationItem.relation].push(relationItem)
          }
        })
      }

      // reverse relation won't display in edit mode
      if (hasReverseRelation && !this.edit) {
        this.artifact_group.reverse_relationships.forEach((relationItem) => {
          if (typeof dict[reverseRelation(relationItem.relation)] === 'undefined') {
            dict[reverseRelation(relationItem.relation)] = [relationItem]
          } else {
            dict[reverseRelation(relationItem.relation)].push(relationItem)
          }
        })
      }
      
      return dict
    },
  },
  methods: {
    getSearcchLinkForArtifact(relation) {
      return "/artifact/" + relation.related_artifact_group.publication.artifact.id
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
