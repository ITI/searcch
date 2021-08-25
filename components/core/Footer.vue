<template>
  <v-footer id="core-footer" height="82">
    <div class="footer-items">
      <span v-for="link in links" :key="link.name">
        <a :href="link.link" class="tertiary--text footer-links">
          {{ link.name }}
        </a>
      </span>
    </div>
    <v-spacer />
    <span class="font-weight-light copyright">
      Template &copy;
      {{ new Date().getFullYear() }}
      <a href="https://www.creative-tim.com/" target="_blank" rel="noopener">
        Creative Tim
      </a>
      , made with
      <v-icon color="tertiary" size="17">mdi-heart</v-icon>
      for a better web
    </span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      {
        link: '',
        name: ''
      }
    ]
  })
}
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
