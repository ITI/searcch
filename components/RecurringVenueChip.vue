<template>
  <v-chip
    cols="12"
    class="ma-2"
    label
    color="green white--text"
    :to="whereTo(item)"
  >
    <v-avatar left>
      <v-icon>{{ venueIcon(item.type) }}</v-icon>
    </v-avatar>
    <div>{{ item.type }}</div>
  </v-chip>
</template>

<script>
import { venueIcon } from '@/helpers'

export default {
  components: {},
  props: {
    item: {
      type: Object,
      required: true
    },
  },
  methods: {
    venueIcon,
    whereTo(item) {
      // if (this.link) {
      //   switch (this.type) {
      //     case 'keyword':
      //       return '/search?keywords=' + item
      //     case 'role':
      //       return '/search?author_keywords=' + item.affiliation.person.name
      //     case 'relation':
      //       return '/artifact/' + item.related_artifact_group_id
      //     case 'reverse-relation':
      //       return '/artifact/' + item.artifact_group_id
      //     case 'venue':
      //       return '/search?venue_ids=' + item.id
      //   }
      // }
      return null
    }
  },
}
</script>
