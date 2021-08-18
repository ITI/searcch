<template>
  <div>
    <v-chip
      v-if="field.length"
      v-for="(item, index) in field"
      :key="`field${index}`"
      cols="12"
      class="ma-2"
      label
      :color="iconColor(type)"
      v-bind:close="edit ? !display : undefined"
      :close-icon="edit ? 'mdi-close' : undefined"
      @click:close="
        if (type === 'relation') deleteRelationship(item.id)
        field.splice(index, 1)
      "
      :to="whereTo(item)"
      v-bind:small="small"
    >
      <v-avatar left>
        <v-icon>{{ iconImage(type) }}</v-icon>
      </v-avatar>
      <div v-if="!isObject(field[index])">
        <v-text-field
          v-if="edit"
          class="m-0"
          solo
          dark
          hide-details
          :background-color="iconColor(type)"
          :placeholder="placeholder"
          v-model="field[index]"
          v-bind:readonly="!create"
        >
          {{ field[index] }}
        </v-text-field>
        <div v-else>
          {{ field[index] | titlecase }}
        </div>
      </div>
      <div v-else-if="type === 'keyword'">
        {{ item.tag }}
      </div>
      <div v-else-if="type === 'role'">
        {{ item.affiliation.person.name }} ({{ item.roles }})
      </div>
      <div v-else-if="type === 'relation'">
        {{ item.relation | titlecase }}: {{ item.related_artifact_id }}
      </div>
    </v-chip>
    <v-btn
      v-if="create"
      @click="field.push('')"
      class="success ml-2 mb-2"
      fab
      x-small
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { artifactIcon, artifactColor } from '@/helpers'

export default {
  components: {},
  props: {
    field: {
      type: [Array, Object],
      required: true,
      default: function() {
        return []
      }
    },
    type: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false
    },
    create: {
      type: Boolean,
      default: false,
      required: false
    },
    edit: {
      type: Boolean,
      default: false,
      required: false
    },
    display: {
      type: Boolean,
      default: false,
      required: false
    },
    link: {
      type: Boolean,
      default: false,
      required: false
    },
    small: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    isObject(item) {
      return typeof item === 'object'
    },
    whereTo(item) {
      if (this.link) {
        switch (this.type) {
          case 'keyword':
            return '/search?keywords=' + item
          case 'relation':
            return '/artifact/' + item.related_artifact_id
        }
      }
      return null
    },
    async deleteRelationship(id) {
      let response = await this.$relationshipEndpoint.delete(id)
    }
  }
}
</script>
