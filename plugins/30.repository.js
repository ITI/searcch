import createRepository from '~/api/repository'
export default defineNuxtPlugin(({ $fetch }) => {
  // inject the repository in the context (ctx.app.$repository)
  // And in the Vue instances (this.$repository in your components)
  const repositoryWithAxios = createRepository($fetch)

  return {
    provide: {
      
      // artifacts
      artifactsEndpoint: repositoryWithAxios('kg/' + 'artifacts'),

      // artifact retrieval
      artifactEndpoint: repositoryWithAxios('kg/' + 'artifact'),

      //artifact claim retrieval
      artifactClaimEndpoint: repositoryWithAxios('kg/' + 'artifact/request/owner'),

      //admin artifact claims retrieval
      adminArtifactClaimEndpoint: repositoryWithAxios('kg/' + 'artifact/requests/owner'),

      // artifact searching
      artifactSearchEndpoint: repositoryWithAxios('kg/' + 'artifact/search'),

      artifactRecommendationEndpoint: repositoryWithAxios('kg/' + 'artifact/recommendation'),

      // imports array view/add API
      importsEndpoint: repositoryWithAxios('kg/' + 'artifact/imports'),

      // import view/modify API
      importEndpoint: repositoryWithAxios('kg/' + 'artifact/import'),

      // get relationships
      relationshipsEndpoint: repositoryWithAxios('kg/' + 'artifact/relationships'),

      // modify relationship
      relationshipEndpoint: repositoryWithAxios('kg/' + 'artifact/relationship'),

      // compare artifacts
      artifactCompareEndpoint: repositoryWithAxios('kg/' + 'artifact/compare'),

      // candidate artifacts
      candidateArtifactEndpoint: repositoryWithAxios('kg/' + 'candidate/artifact'),

      // badges
      badgesEndpoint: repositoryWithAxios('kg/' + 'badges'),

      // venues
      venuesEndpoint: repositoryWithAxios('kg/' + 'venues'),

      // licenses
      licenseEndpoint: repositoryWithAxios('kg/' + 'licenses'),

      // backend login credentials
      loginEndpoint: repositoryWithAxios('kg/' + 'login'),

      // favorites lookup
      findFavoritesEndpoint: repositoryWithAxios('kg/' + 'favorites'),

      // favorites modify API
      favoritesEndpoint: repositoryWithAxios('kg/' + 'favorite'),

      // ratings modify API
      ratingsEndpoint: repositoryWithAxios('kg/' + 'rating'),

      // reviews modify API
      reviewsEndpoint: repositoryWithAxios('kg/' + 'review'),

      // users index API
      usersEndpoint: repositoryWithAxios('kg/' + 'users'),

      // user API
      userEndpoint: repositoryWithAxios('kg/' + 'user'),

      // admin update privilege API
      adminUpdateUserEndpoint: repositoryWithAxios('kg/' + 'admin/user'),

      // user owned artifacts API
      userArtifactsEndpoint: repositoryWithAxios('kg/' + 'user/artifacts'),

      // user affiliations
      userAffiliationsEndpoint: repositoryWithAxios('kg/' + 'user/affiliations'),

      // user affiliation modification
      userAffiliationEndpoint: repositoryWithAxios('kg/' + 'user/affiliation'),

      // organization API
      organizationEndpoint: repositoryWithAxios('kg/' + 'organizations'),

      // interests API
      interestsEndpoint: repositoryWithAxios('kg/' + 'interests'),

      // dashboard API
      dashboardEndpoint: repositoryWithAxios('kg/' + 'dashboard'),

      // importers array view API
      importersEndpoint: repositoryWithAxios('kg/' + 'importers'),

      // importer view/modify API
      importerEndpoint: repositoryWithAxios('kg/' + 'importer'),

      // session operation API
      sessionEndpoint: repositoryWithAxios('kg/' + 'session'),

      // sessions index API
      sessionsEndpoint: repositoryWithAxios('kg/' + 'sessions'),

      // user request ownership API
      requestOwnershipEndpoint: repositoryWithAxios('/kg' + '/requests/ownership'),
    }
  }
})
