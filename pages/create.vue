<template>
  <v-layout column justify-left align-top>
    <v-container fill-height fluid>
      <v-row justify="center">
        <v-col cols="12" md="4">
          <!-- <ArtifactView></ArtifactView> -->
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col cols="12" lg="12">
          <ArtifactEdit :record="emptyArtifact" create />
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  components: {
    ArtifactEdit: () => import('@/components/ArtifactEdit'),
    ArtifactView: () => import('@/components/ArtifactView')
  },
  head() {
    return {
      title: 'SEARCCH Manual Artifact Creation',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Hub Manual Artifact Creation'
        }
      ]
    }
  },
  data() {
    return {
      emptyArtifact: {
        artifact: {
          title: '',
          description: '',
          url: '',
          tags: [],
          affiliations: [],
          relationships: [],
          files: [],
          meta: []
        }
      }
    }
  }
}
</script>
