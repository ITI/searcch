<template>
  <LazyHydrate never>
    <div>
      <v-card elevation="1">
        <v-card-title class="primary white--text">
          <span class="text-h6">Supporters</span>
        </v-card-title>
        <v-card-text>
          <br />
          <ul>
            <li>
              The SEARCCH hub is community infrastructure supported by the
              National Science Foundation's CCRI and SATC programs. Visit the
              <a href="https://www.ccrivo.org/">CCRI-VO website</a> to discover
              other infrastructure supported by the CCRI program.
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </div>
  </LazyHydrate>
</template>

<script>
export default {
  components: {
    LazyHydrate: () => import('vue-lazy-hydration'),
  },
}
</script>