import { artifactsStore } from '~/stores/artifacts'
import { systemStore } from '~/stores/system'
import { userStore } from '~/stores/user'
import { appStore } from '~/stores/app'

export default defineNuxtPlugin(({ $pinia }) => {
  return {
    provide: {
        artifactsStore: artifactsStore($pinia),
        systemStore: systemStore($pinia),
        userStore: userStore($pinia),
        appStore: appStore($pinia),
    }
  }
})