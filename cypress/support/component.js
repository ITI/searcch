import './commands';
import {mount} from 'cypress/vue';
import {h, Suspense} from 'vue';
import {getContext} from 'unctx';
import {
  createRouter,
  createWebHistory,
  RouterLink,
  routerKey,
  routeLocationKey
} from 'vue-router';
import { createVuetify } from 'vuetify';
import { VApp } from 'vuetify/components';

const nuxtAppCtx = getContext('nuxt-app');
const $router = createRouter({
  routes: [],
  history: createWebHistory()
});
const generateNuxtCTX = () => ({
  static: {data: {}},
  payload: {data: {}, _errors: {}},
  hook: () => () => ({}),
  hooks: {
    callHook: () => Promise.resolve()
  },
  _asyncData: {},
  _asyncDataPromises: {},
  _useHead: () => ({}),
  $router,
  _route: $router.currentRoute
});
let nuxtCTX = generateNuxtCTX();

nuxtAppCtx.set(nuxtCTX);

Cypress.Commands.add('mount', (component, options = {}) => {
  const vuetify = createVuetify();

  options.global = options.global || {};
  options.global.plugins = options.global.plugins || [];
  options.global.plugins.push(vuetify);
  options.global.components = {RouterLink};
  options.global.provide = {
    [routerKey]: $router,
    [routeLocationKey]: $router.currentRoute.value
  };

  return mount(
    () => h(Suspense, h(VApp, h(component, options?.props, options?.slots))),
    options
  );
});

Cypress.Commands.add('stubNuxtInject', (key, value) => {
  nuxtCTX['$' + key] = value;
});

Cypress.Commands.add('stubNuxtRouter', callback => {
  callback($router);
});

Cypress.Commands.add('resetNuxt', () => {
  nuxtCTX = generateNuxtCTX();
  nuxtAppCtx.unset();
  nuxtAppCtx.set(nuxtCTX);

  $router.push('/');
});