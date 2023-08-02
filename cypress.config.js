import { defineConfig } from 'cypress';
import { loadNuxt, build } from 'nuxt';

async function getNuxtViteConfig() {
  const nuxt = await loadNuxt({
    cwd: process.cwd(),
    dev: false,
    overrides: {
      ssr: false
    }
  });
  return new Promise((resolve, reject) => {
    nuxt.hook('vite:extendConfig', config => {
      resolve(config);
      throw new Error('_stop_');
    });
    build(nuxt).catch(err => {
      if (!err.toString().includes('_stop_')) {
        reject(err);
      }
    });
  }).finally(() => nuxt.close());
}

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      async viteConfig() {
        const config = await getNuxtViteConfig();

        config.plugins = config?.plugins?.filter(
          item => !['replace', 'vite-plugin-eslint'].includes(item.name)
        );

        if (config.server) {
          config.server.middlewareMode = false;
        }

        return config;
      }
    }
  }
});
