<template>
  <div>
    <h1>
      Zenodo Artifact
      <a v-if="record.links" :href="record.links.html" target="_blank">
        {{ record.id }}
      </a>
    </h1>

    <v-card class="mx-auto my-12">
      <v-img
        height="20"
        width="172"
        v-if="record.links && record.metadata && record.files && record.links"
        :src="record.links.badge"
      ></v-img>

      <v-card-title> {{ record.title }} </v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <v-rating
            v-model="rating"
            color="amber"
            dense
            half-increments
            hover
            size="18"
          ></v-rating>
          <div class="grey--text ml-4">{{ rating }} (42)</div>
        </v-row>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Metadata</v-card-title>

      <v-card-text v-for="(v, k) in record.metadata" :key="k" cols="12">
        <div class="my-4 subtitle-1">
          {{ k }}
        </div>
        <div v-html="v"></div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Files</v-card-title>

      <v-card-text v-for="(v, k) in record.files" :key="k" cols="12">
        <div class="my-4 subtitle-1">
          {{ k }}
        </div>
        <div v-html="v"></div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Links</v-card-title>

      <v-card-text v-for="(v, k) in record.links" :key="k" cols="12">
        <div class="my-4 subtitle-1">
          {{ k }}
        </div>
        <div v-html="v"></div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Full Record</v-card-title>

      <v-card-text v-for="(v, k) in record" :key="k" cols="12">
        <div class="my-4 subtitle-1">
          {{ k }}
        </div>
        <div v-html="v"></div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ZenodoArtifactLong',
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rating: 4.5
    }
  }
}
</script>
