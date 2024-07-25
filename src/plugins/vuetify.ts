/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import type { ThemeDefinition } from 'vuetify'

// Composables
import { createVuetify } from 'vuetify'

const customDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: '#FF702D',
        secondary: '#26497F',
        background: '#212121',
        error: '#DC4C64',
        success: '#E25D1F',
        // primary: '#0277BD',
        // secondary: '#607D8B',
        // background: '#212121',
        // error: '#DC4C64',
        // success: '#00BBC7',
        dark: '#000000',
        light: '#FFFFFF'
    }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'customDarkTheme',

    variations: {
        colors: ['primary', 'secondary'],
        lighten: 1,
        darken: 1
    },
    themes: {
        customDarkTheme
    }
},
})
