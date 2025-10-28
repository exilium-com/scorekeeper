/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import type { ThemeDefinition } from 'vuetify'
import { VNumberInput } from 'vuetify/components'

// Composables
import { createVuetify } from 'vuetify'

const customDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: '#FF702D',
        secondary: '#26497F',
        background: '#212121',
        error: '#FF702D',
        success: '#E25D1F',
        dark: '#000000',
        light: '#FFFFFF',
        winner: '#CCA300',
    },
}

const customLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: '#FF702D',
        secondary: '#26497F',
        background: '#FFFFFF',
        info: '#0099A7',
        error: '#FF702D',
        success: '#FF6923',
        dark: '#162C49',
        light: '#D1E5F1',
        winner: '#B29100',
    },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    components: {
        VNumberInput,
    },
    theme: {
        defaultTheme: 'customLightTheme',

        variations: {
            colors: ['primary', 'secondary'],
            lighten: 1,
            darken: 1,
        },
        themes: {
            customDarkTheme,
            customLightTheme,
        },
    },
})
