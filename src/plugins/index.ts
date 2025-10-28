/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Types
import type { App } from 'vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export function registerPlugins(app: App) {
    app.use(pinia).use(vuetify).use(router)
}
