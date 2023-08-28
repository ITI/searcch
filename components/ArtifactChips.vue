<template>
  <div>
    <v-chip
      v-if="fieldData.length"
      v-for="(item, index) in fieldData"
      :key="`field${index}`"
      cols="12"
      class="ma-2"
      label
      :color="iconColor(type, item)"
      v-bind:closable="edit ? !display : undefined"
      :close-icon="edit ? 'mdi-close' : undefined"
      @click:close="onDeleteChip(irem, index)"
      :to="whereTo(item)"
      v-bind:small="small"
    >
      <v-avatar start>
        <v-icon>{{ iconImage(type, item) }}</v-icon>
      </v-avatar>
      <div v-if="!isObject(fieldData[index])">
        <v-text-field
          v-if="edit"
          class="m-0 input-chip"
          variant="solo"
          theme="dark"
          hide-details
          center-affix
          :bg-color="iconColor(type, fieldData[index])"
          :placeholder="placeholder"
          v-model="fieldData[index]"
          v-bind:readonly="!create"
          :rules="[rules.required, rules.exists, rules.validated]"
          required
        >
          {{ fieldData[index] }}
        </v-text-field>
        <div v-else>
          {{ fieldData[index] }}
        </div>
      </div>
      <div v-else-if="type === 'keyword'">
        {{ item.tag }}
      </div>
      <div v-else-if="type === 'venue'">
        {{ item.venue.abbrev || item.venue.title }}
      </div>
      <div v-else-if="type === 'role'">
        {{ item.affiliation.person.name }}
        <span v-if="item.affiliation.org && item.affiliation.org.name">({{ item.affiliation.org.name }})</span>
        <span v-if="edit && item.affiliation.person && item.affiliation.person.email">({{ item.affiliation.person.email }})</span>
      </div>
      <div v-else-if="type === 'relation'">
        {{ item.artifact_id }} {{ $filters.titlecase(item.relation) }}
        {{ item.related_artifact_id }}
      </div>
      <div v-else-if="type === 'reverse-relation'">
        {{ item.related_artifact_id }}
        {{ $filters.titlecase(flipRelation(item.relation)) }}
        {{ item.artifact_id }}
      </div>
    </v-chip>
    <v-btn
      v-if="create"
      @click="fieldData.push('')"
      class="ml-2 mb-2 text-success"
      variant="tonal"
      density="compact"
      icon="mdi-plus"
      :disabled="typeof this.formModel !== 'undefined' ? !formModel : false"
    ></v-btn>
  </div>
</template>

<script>
import { artifactIcon, artifactColor, venueIcon, reverseRelation } from '@/helpers'
import { isEqual } from 'lodash';

// properties are not suppose to change in vue, so we copy the object and change copy
export default defineComponent({
  props: {
    modelValue: {
      type: [Array, Object, String],
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
    },
    validator: {
      type: Function,
      default: undefined,
      required: false
    },
    formModel: {
      type: Boolean,
      default: undefined,
      required: false
    }
  },
  data() {
    return {
      rules: {
        required: value => !!value || 'required',
        exists: value => {
          return typeof value === 'string' ? value.length > 0 : false
        },
        validated: value => {
          return (typeof this.validator !== "undefined") ? this.validator(value) : true
        },
      },
      fieldData: [],
    }
  },
  mounted() {
    Object.assign(this.fieldData, this.modelValue)
  },
  watch: {
    field() {
      Object.assign(this.fieldData, this.modelValue)
    },
    fieldData: {
      deep: true,
      handler() {
        if (typeof this.fieldData !== 'undefined' && !isEqual(this.fieldData, this.modelValue)) {
          this.$emit('update:modelValue', this.fieldData)
        }
      }
    }
  },
  methods: {
    flipRelation(type) {
      return reverseRelation(type)
    },
    iconColor(type, item) {
      if (type == "venue")
        return 'green white--text'
      return artifactColor(type)
    },
    iconImage(type, item) {
      if (type == "venue")
        return venueIcon(item.venue.type)
      return artifactIcon(type)
    },
    isObject(item) {
      return typeof item === 'object'
    },
    isString(item) {
      return typeof item === 'string'
    },
    whereTo(item) {
      if (this.link) {
        switch (this.type) {
          case 'keyword':
            return '/search?keywords=' + item
          case 'role':
            return '/search?author_keywords=' + item.affiliation.person.name
          case 'relation':
            return '/artifact/' + item.related_artifact_group_id
          case 'reverse-relation':
            return '/artifact/' + item.artifact_group_id
          case 'venue':
            return '/search?venue_ids=' + item.id
        }
      }
      return null
    },
    onDeleteChip(item, index) {
      if (this.type === 'relation') 
        this.deleteRelationship(item.id)
      this.fieldData.splice(index, 1)
    },
    async deleteRelationship(id) {
      let response = await this.$relationshipEndpoint.delete(id)
    }
  }
});
</script>

<style>
.input-chip input {
  color: transparent
}
</style>
