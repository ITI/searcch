<template>
  <v-container>
    <v-row v-if="this.curation.id" class="mx-0">
      Curation ID: {{ this.curation.id }}
    </v-row>
    <v-row v-if="this.status" class="mx-0">
      Status: {{ this.status ? "success" : "failed" }}
    </v-row>
    <v-row v-if="this.message" class="mx-0">
      Message: {{ this.message }}
    </v-row>
    <v-row v-if="this.curation.curator" class="mx-0">
      Curator: &nbsp;
      <a :href="`/profile/${this.curation.curator.id}`" rel="noopener">
        {{ this.curation.curator.person.name }}
      </a>
    </v-row>
    <v-row v-if="this.curation.time" align="center" class="mx-0">
      Created: {{ $moment(this.curation.time) }}
    </v-row>
    <v-row align="center" class="mx-0">
      <span>
        <b>{{$filters.titlecase( this.curation.opdata.op ) }}</b>
        ({{ this.curation.opdata.obj }}{{ this.curation.opdata.op === 'set'
                                          ? "." + this.curation.opdata.data.field : "" }}): 
      </span>
      <span v-if="opIsSetField">
        <v-row align="center">
        <ArtifactChips
          :field="[this.curation.opdata.data.value]"
          type="field"
          align="center"
        ></ArtifactChips>
        previous:
        <ArtifactChips
          :v-if="this.curation.opdata.data.old_value !== 'undefined'"
          :field="[this.curation.opdata.data.old_value]"
          type="field"
        ></ArtifactChips>
        </v-row>
      </span>
      <span v-else-if="opIsSoftware">
        <ArtifactChips
          :field="this.curation.opdata.data.value.value !== 'undefined'
                    ? this.curation.opdata.data.value.value.split(',')
                    : this.curation.opdata.data.value.value"
          type="software"
        ></ArtifactChips>
      </span>
      <span v-else-if="opIsTag">
        <ArtifactChips
          :field="[this.curation.opdata.data.value.tag]"
          type="keyword"
        ></ArtifactChips>
      </span>
      <span v-else-if="opIsAffiliation">
        <ArtifactChips
          :field="[this.curation.opdata.data.value]"
          type="role"
        ></ArtifactChips>
      </span>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default defineComponent({
  props: {
    curation: {
      type: Object,
      required: true,
      default: function() {
        return {}
      }
    },
    status: {
      type: Boolean,
      required: false,
      default: undefined
    },
    message: {
      type: String,
      required: false,
      default: undefined
    },
  },
  components: {
    ArtifactChips: defineAsyncComponent(() => import('@/components/ArtifactChips'))
  },
  computed: {
    opIsSetField: function() {
      return (this.curation.opdata.op === 'set'
              && this.curation.opdata.data.field !== 'undefined')
    },
    opIsSoftware: function() {
      return (this.curation.opdata.obj === 'ArtifactMetadata'
              && this.curation.opdata.data.value.name === 'languages')
    },
    opIsTag: function() {
      return this.curation.opdata.obj === 'ArtifactTag'
    },
    opIsAffiliation: function() {
      return this.curation.opdata.obj === 'ArtifactAffiliation'
    }
  },
  data() {
    return {}
  },
  methods: {
    isObject(item) {
      return typeof item === 'object'
    },
  }
});
</script>
