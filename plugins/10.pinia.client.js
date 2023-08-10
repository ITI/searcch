import { artifactsStore } from '~/stores/artifacts'
import { systemStore } from '~/stores/system'
import { userStore } from '~/stores/user'
import { appStore } from '~/stores/app'

export default defineNuxtPlugin(({ $pinia }) => {
  const artifacts = artifactsStore($pinia)
  const system = systemStore($pinia)
  const user = userStore($pinia)
  const app = appStore($pinia)

  if (window.Cypress) {
    console.log('cypress found ... inject stores')
    window.artifactsStore = artifacts
    window.systemStore = system
    window.userStore = user
    window.appStore = app
  }

  return {
    provide: {
      artifactsStore: artifacts,
      systemStore: system,
      userStore: user,
      appStore: app,
    }
  }
})