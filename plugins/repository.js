import createRepository from '~/api/repository'
export default (ctx, inject) => {
  // inject the repository in the context (ctx.app.$repository)
  // And in the Vue instances (this.$repository in your components)
  const repositoryWithAxios = createRepository(ctx.$axios)

  // artifacts
  inject('artifactsEndpoint', repositoryWithAxios('kg/' + 'artifacts'))

  // artifact retrieval
  inject('artifactRecordEndpoint', repositoryWithAxios('kg/' + 'artifact'))

  // artifact searching
  inject(
    'artifactSearchEndpoint',
    repositoryWithAxios('kg/' + 'artifact/search')
  )

  // imports array view/add API
  inject('importsEndpoint', repositoryWithAxios('kg/' + 'artifact/imports'))

  // import view/modify API
  inject('importEndpoint', repositoryWithAxios('kg/' + 'artifact/import'))

  // get relationships
  inject(
    'relationshipsEndpoint',
    repositoryWithAxios('kg/' + 'artifact/relationships')
  )

  // modify relationship
  inject(
    'relationshipEndpoint',
    repositoryWithAxios('kg/' + 'artifact/relationship')
  )

  // badges
  inject('badgesEndpoint', repositoryWithAxios('kg/' + 'badges'))

  // licenses
  inject('licenseEndpoint', repositoryWithAxios('kg/' + 'licenses'))

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

  // users index API
  inject('usersEndpoint', repositoryWithAxios('kg/' + 'users'))

  // user API
  inject('userEndpoint', repositoryWithAxios('kg/' + 'user'))

  // user owned artifacts API
  inject('userArtifactsEndpoint', repositoryWithAxios('kg/' + 'user/artifacts'))

  // user affiliations
  inject(
    'userAffiliationsEndpoint',
    repositoryWithAxios('kg/' + 'user/affiliations')
  )

  // user affiliation modification
  inject(
    'userAffiliationEndpoint',
    repositoryWithAxios('kg/' + 'user/affiliation')
  )

  // organization API
  inject('organizationEndpoint', repositoryWithAxios('kg/' + 'organizations'))

  // interests API
  inject('interestsEndpoint', repositoryWithAxios('kg/' + 'interests'))

  // dashboard API
  inject('dashboardEndpoint', repositoryWithAxios('kg/' + 'dashboard'))

  // importers array view API
  inject('importersEndpoint', repositoryWithAxios('kg/' + 'importers'))

  // importer view/modify API
  inject('importerEndpoint', repositoryWithAxios('kg/' + 'importer'))

  // session operation API
  inject('sessionEndpoint', repositoryWithAxios('kg/' + 'session'))

  // sessions index API
  inject('sessionsEndpoint', repositoryWithAxios('kg/' + 'sessions'))
}
