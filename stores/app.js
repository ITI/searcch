import { defineStore } from 'pinia'

export const appStore = defineStore('app', {
  state: () => ({
    drawer: null,
    color: 'success'
  }),
});