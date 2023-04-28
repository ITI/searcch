// import DOMPurify from "dompurify"
import { Resolver } from '@stoplight/json-ref-resolver';

export default defineNuxtPlugin((nuxtApp) => {
  const resolver = new Resolver();
  return {
    provide: {
      resolver
    }
  }
});