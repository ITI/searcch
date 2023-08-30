<template>
  <v-row class="align-center my-2">
    <v-col class="pa-0" cols="auto"
      v-if="fields.length"
      v-for="(item, index) in fields"
      :key="item.id"
    >
      <v-chip
        class="ma-1"
        label
        :color="iconColor(type, item.value)"
        v-bind:closable="edit ? !display : undefined"
        :close-icon="edit ? 'mdi-close' : undefined"
        @click:close="onDeleteChip(item.value, index)"
        :to="whereTo(item.value)"
        v-bind:small="small"
      >
        <v-avatar start>
          <v-icon>{{ iconImage(type, item.value) }}</v-icon>
        </v-avatar>
        <div v-if="!isObject(item.value)">
          <v-text-field
            v-if="edit"
            class="m-0 input-chip"
            theme="dark"
            hide-details
            single-line
            :bg-color="iconColor(type, item.value)"
            :placeholder="placeholder"
            v-model="item.value"
            v-bind:readonly="!create"
            :rules="[rules.required, rules.exists, rules.validated]"
            required
          ></v-text-field>
          <div v-else>
            {{ item.value }}
          </div>
        </div>
        <div v-else-if="type === 'keyword'">
          {{ item.value.tag }}
        </div>
        <div v-else-if="type === 'venue'">
          {{ item.value.venue.abbrev || item.value.venue.title }}
        </div>
        <div v-else-if="type === 'role'">
          {{ item.value.affiliation.person.name }}
          <span v-if="item.value.affiliation.org && item.value.affiliation.org.name">({{ item.value.affiliation.org.name }})</span>
          <span v-if="edit && item.value.affiliation.person && item.value.affiliation.person.email">({{ item.value.affiliation.person.email }})</span>
        </div>
        <div v-else-if="type === 'relation'">
          {{ item.value.artifact_id }} {{ $filters.titlecase(item.value.relation) }}
          {{ item.value.related_artifact_id }}
        </div>
        <div v-else-if="type === 'reverse-relation'">
          {{ item.value.related_artifact_id }}
          {{ $filters.titlecase(flipRelation(item.value.relation)) }}
          {{ item.value.artifact_id }}
        </div>
      </v-chip>
    </v-col>
    <v-col cols="auto" class="pa-0">
      <v-btn
        v-if="create"
        @click="fields.push({
          id: Math.random().toString(36).slice(2),
          value: ''
        })"
        class="text-success"
        variant="tonal"
        density="compact"
        icon="mdi-plus"
        :disabled="typeof this.formModel !== 'undefined' ? !formModel : false"
      ></v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { artifactIcon, artifactColor, venueIcon, reverseRelation } from '@/helpers'
import isEqual from 'lodash.isequal';

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
      fields: [],
    }
  },
  // why do we need separate id for each field instead of using index directly?
  // Because indexes will change when we splice fields,
  // if we use index as key, vue will display wrong data in
  // frontend since it internally uses index as key (guess)
  created() {
    Object.assign(this.fields, this.modelValue.map((item) => ({
      id: Math.random().toString(36).slice(2),
      value: item
    })))
  },
  watch: {
    modelValue: {
      deep: true,
      handler() {
        if (isEqual(this.fields.map(e => e.value), this.modelValue)) return
        Object.assign(this.fields, this.modelValue.map((item) => ({
          id: Math.random().toString(36).slice(2),
          value: item
        })))
      }
    },
    fields: {
      deep: true,
      handler() {
        this.$emit('update:modelValue', this.fields.map((item) => item.value))
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
      this.fields.splice(index, 1)
    },
    async deleteRelationship(id) {
      let response = await this.$relationshipEndpoint.delete(id)
    },
  }
});
</script>

<style scoped>
.input-chip {
  min-width: 150px;
}
</style>