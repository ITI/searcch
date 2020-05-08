<template>
  <v-content class="grey lighten-3">
    <div id="core-view">
      <v-fade-transition mode="out-in">
        <nuxt></nuxt>
      </v-fade-transition>
    </div>
  </v-content>
</template>

<script>
export default {
  name: 'CoreView'
}
</script>
