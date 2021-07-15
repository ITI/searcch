<template>
  <LazyHydrate never>
    <div>
      <img
        src="/images/horiz-tagline.png"
        width="433"
        height="138"
        alt="SEARCCH Tagline"
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
