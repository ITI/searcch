import createRepository from '~/api/repository'
export default (ctx, inject) => {
  // inject the repository in the context (ctx.app.$repository)
  // And in the Vue instances (this.$repository in your components)
  const repositoryWithAxios = createRepository(ctx.$axios)
  inject(
    'zenodoRecordRepository',
    repositoryWithAxios('https://zenodo.org/api/' + 'records')
  )

  // knowledge graph searching
  inject(
    'knowledgeGraphSearchRepository',
    repositoryWithAxios('kg/' + 'artifacts')
  )

  // knowledge graph record retrieval
  inject(
    'knowledgeGraphRecordRepository',
    repositoryWithAxios('kg/' + 'artifact')
  )

  // knowledge graph record retrieval
  inject(
    'loginEndpoint',
    repositoryWithAxios('kg/' + 'login')
  )
}
