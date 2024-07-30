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
        dark: '#000000',
        light: '#FFFFFF',
    }
}

const customLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: '#FF702D',
        secondary: '#26497F',
        background: '#FFFFFF',
        info: '#0099A7',
        error: '#DC4C64',
        success: '#E25D1F',
        dark: '#162C49',
        light: '#D1E5F1',
    }
}


// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'customLightTheme',

    variations: {
        colors: ['primary', 'secondary'],
        lighten: 1,
        darken: 1
    },
    themes: {
        customDarkTheme,
        customLightTheme
    }
},
})
