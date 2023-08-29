import mitt from 'mitt'

export default defineNuxtPlugin(() => {
  const emitter = mitt()

  return {
    provide: {
      trigger: emitter.emit,
      on: emitter.on,
    }
  }
})