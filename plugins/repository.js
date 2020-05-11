import createRepository from '~/api/repository'
export default (ctx, inject) => {
  // inject the repository in the context (ctx.app.$repository)
  // And in the Vue instances (this.$repository in your components)
  const repositoryWithAxios = createRepository(ctx.$axios)
  inject(
    'zenodoRecordRepository',
    repositoryWithAxios('https://zenodo.org/api/' + 'records')
  )
  // knowledge graph
  inject(
    'knowledgeGraphRepository',
    repositoryWithAxios(
      'http://ec2-54-67-82-172.us-west-1.compute.amazonaws.com/' + 'search'
    )
  )
}
