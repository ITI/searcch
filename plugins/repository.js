import createRepository from '~/api/repository'
export default (ctx, inject) => {
  // inject the repository in the context (ctx.app.$repository)
  // And in the Vue instances (this.$repository in your components)
  const repositoryWithAxios = createRepository(ctx.$axios)

  // affiliations
  inject(
    'userAffiliationsEndpoint',
    repositoryWithAxios('kg/' + 'user/affiliations')
  )

  // artifact searching
  inject('artifactsEndpoint', repositoryWithAxios('kg/' + 'artifacts'))

  // artifact retrieval
  inject('artifactRecordEndpoint', repositoryWithAxios('kg/' + 'artifact'))

  // imports array view/add API
  inject('importsEndpoint', repositoryWithAxios('kg/' + 'artifact/imports'))

  // import view/modify API
  inject('importEndpoint', repositoryWithAxios('kg/' + 'artifact/import'))

  // add relationship
  inject(
    'relationshipsEndpoint',
    repositoryWithAxios('kg/' + 'artifact/relationships')
  )

  // badges
  inject('badgesEndpoint', repositoryWithAxios('kg/' + 'badges'))

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

  // user affiliations
  inject(
    'userAffiliationsEndpoint',
    repositoryWithAxios('kg/' + 'user/affiliations')
  )

  // organization API
  inject('organizationEndpoint', repositoryWithAxios('kg/' + 'organizations'))

  // interests API
  inject('interestsEndpoint', repositoryWithAxios('kg/' + 'interests'))

  // dashboard API
  inject('dashboardEndpoint', repositoryWithAxios('kg/' + 'dashboard'))
}
