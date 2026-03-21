// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },
  },
  extends: [
    './layers/AI', // ← this makes auth server routes available
    './layers/base',
    './layers/feed',
    './layers/seller',
    './layers/profile',
    './layers/commerce',
    './layers/post',
    // ... other layers
  ],
  modules: [
    '@nuxt/icon',
    '@pinia/nuxt',
    'nuxt3-notifications',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n',
  ],

  i18n: {
    defaultLocale: 'en',
    langDir: 'locales/',
    lazy: true,
    strategy: 'no_prefix',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'zh', name: '中文', file: 'zh.json' },
      { code: 'ar', name: 'العربية', file: 'ar.json', dir: 'rtl' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
  },

  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dcci05bzj',
    },
  },

  nitro: {
    plugins: ['plugins/monitoring', 'plugins/workers'],
    compressPublicAssets: true,
    minify: true,
    experimental: {
      websocket: true,
      tasks: true,
    },
    scheduledTasks: {
      // Every minute: drain audit, notification, and email queues
      '* * * * *': ['processQueues'],
      // Every 6 hours: auto-release funds for orders shipped 7+ days ago
      '0 */6 * * *': ['releaseShippedOrders'],
    },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router', 'pinia'],
            'vendor-ui': ['@vueuse/core'],
          },
        },
      },
    },
  },

  colorMode: {
    preference: 'system', // default preference: 'system' | 'light' | 'dark'
    fallback: 'light', // fallback if no preference detected/stored
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: 'theme-',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode',
  },
  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    grokApiKey: process.env.GROK_API_KEY,
    googleApiKey: process.env.GOOGLE_API_KEY,
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
    upstashRedisUrl: process.env.UPSTASH_REDIS_REST_URL,
    upstashRedisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
    platformCommissionRate: process.env.PLATFORM_COMMISSION_RATE,
    resendApiKey: process.env.RESEND_API_KEY,
    // Shipping providers
    shippoApiKey: process.env.SHIPPO_API_KEY,
    shippoWebhookSecret: process.env.SHIPPO_WEBHOOK_SECRET,
    sendboxAccessToken: process.env.SENDBOX_ACCESS_TOKEN,
    sendboxClientSecret: process.env.SENDBOX_CLIENT_SECRET,
    sendboxWebhookSecret: process.env.SENDBOX_WEBHOOK_SECRET,
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    // Soketi / Pusher (server-side: app secret + host)
    soketiAppId: process.env.SOKETI_APP_ID || '1',
    soketiKey: process.env.SOKETI_KEY || 'app-key',
    soketiSecret: process.env.SOKETI_SECRET || 'app-secret',
    soketiHost: process.env.SOKETI_HOST || '127.0.0.1',
    soketiPort: process.env.SOKETI_PORT || '6001',
    soketiUseTLS: process.env.SOKETI_USE_TLS || 'false',
    public: {
      siteName: process.env.NUXT_PUBLIC_SITE_NAME,
      baseURL: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      paystackPk: process.env.PAYSTACK_PUBLIC_KEY,
      CloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
      senderEmail: process.env.SENDER_EMAIL,
      // Soketi / Pusher (client-side: public key + host only — no secret)
      soketiKey: process.env.SOKETI_KEY || 'app-key',
      soketiHost: process.env.SOKETI_HOST || '127.0.0.1',
      soketiPort: process.env.SOKETI_PORT || '6001',
      soketiUseTLS: process.env.SOKETI_USE_TLS || 'false',
    },
    private: {
      cloudinary: {
        apiSecret: process.env.CLOUDINARY_API_SECRET,
      },
    },
  },
})
