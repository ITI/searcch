import createRepository from '~/api/repository'
export default (ctx, inject) => {
  // inject the repository in the context (ctx.app.$repository)
  // And in the Vue instances (this.$repository in your components)
  const repositoryWithAxios = createRepository(ctx.$axios)

  // backend searching
  inject('artifactSearchRepository', repositoryWithAxios('kg/' + 'artifacts'))

  // backend record retrieval
  inject('artifactRecordRepository', repositoryWithAxios('kg/' + 'artifact'))

  // imports array view/add API
  inject('importsEndpoint', repositoryWithAxios('kg/' + 'artifact/imports'))

  // import view/modify API
  inject('importEndpoint', repositoryWithAxios('kg/' + 'artifact/import'))

  // backend login credentials
  inject('loginEndpoint', repositoryWithAxios('kg/' + 'login'))

  // favorites lookup
  inject('findFavoritesEndpoint', repositoryWithAxios('kg/' + 'favorites'))

  // favorites modify API
  inject('favoritesEndpoint', repositoryWithAxios('kg/' + 'favorite'))

  // ratings modify API
  inject('ratingsEndpoint', repositoryWithAxios('kg/' + 'rating'))

  // reviews modify API
  inject('reviewsEndpoint', repositoryWithAxios('kg/' + 'review'))

  // user API
  inject('userEndpoint', repositoryWithAxios('kg/' + 'user'))

  // user owned artifacts API
  inject('userArtifactsEndpoint', repositoryWithAxios('kg/' + 'user/artifacts'))

  // organization API
  inject('organizationEndpoint', repositoryWithAxios('kg/' + 'organizations'))

  // interests API
  inject('interestsEndpoint', repositoryWithAxios('kg/' + 'interests'))

  // dashboard API
  inject('dashboardEndpoint', repositoryWithAxios('kg/' + 'dashboard'))
}
