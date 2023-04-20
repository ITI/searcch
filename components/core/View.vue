<template>
  <v-main class="grey lighten-3">
    <div id="core-view">
      <v-fade-transition mode="out-in">
        <slot/>
      </v-fade-transition>
    </div>
  </v-main>
</template>

<script>
export default defineComponent({
  name: 'CoreView'
});
</script>
