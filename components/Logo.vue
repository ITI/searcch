<template>
  <LazyHydrate never>
    <div>
      <img
        src="/images/horiz-tagline.png"
        width="503"
        height="100"
        alt="COMUNDA Tagline"
        srcset=""
      />
    </div>
  </LazyHydrate>
</template>

<script>
export default {
  components: {
    LazyHydrate: () => import('vue-lazy-hydration')
  }
}
</script>
