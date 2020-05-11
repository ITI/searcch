<template>
  <div>
    <v-card class="mx-auto overflow-hidden">
      <v-card-title class="align-start">
        <div>
          <span class="headline">{{ title | titlecase }}</span>
        </div>
      </v-card-title>
      <v-card-text>
        <span class="pl-2 grey--text text--darken-2 font-weight-light caption">
          42 reviews
        </span>
        <v-spacer></v-spacer>
        <v-rating
          :value="4.5"
          color="amber"
          dense
          half-increments
          readonly
          size="18"
        ></v-rating>
      </v-card-text>

      <v-card-text v-html="description"> </v-card-text>

      <v-card-actions>
        <v-btn icon>
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>

        <v-btn icon :to="`/artifact/comment/${id}`" nuxt>
          <v-icon>mdi-comment</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          small
          replace
          color="info"
          :to="`/artifact/${id}`"
          nuxt
          target="_blank"
        >
          Read More
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script>
