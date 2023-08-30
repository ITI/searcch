import { defineConfig } from 'cypress';
import { loadNuxt, build } from 'nuxt';
import vue from '@vitejs/plugin-vue';
import { config } from 'dotenv';

config();

async function getNuxtViteConfig() {
  const nuxt = await loadNuxt({
    cwd: process.cwd(),
    dev: false,
    overrides: {
      ssr: false,
      vite: {
        plugins: [vue()],
        server: {
          hmr: {
            protocol: 'ws'
          }
        }
      },
    },
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
  env: {
    // Google
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    testUserId: 999,
    testUserName: 'testuser',
    testUserEmail: 'testuser@cyberexperimentation.org',
  }, 
  e2e: {
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    viewportHeight: 800,
    viewportWidth: 1280,
  },
  component: {
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
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
