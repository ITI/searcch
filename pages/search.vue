<template>
  <div>
    <div class="text-center mb-16">
      <logo />
    </div>
    <SearchCard />
  </div>
</template>

<script>
export default {
  components: {
    Logo: () => import('@/components/Logo'),
    SearchCard: () => import('@/components/SearchCard')
  },
  head() {
    return {
      title: 'SEARCCH Artifact Search',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Hub Artifact Search Results'
        }
      ]
    }
  },
  data() {
    return {}
  }
}
</script>
