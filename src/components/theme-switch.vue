<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useScoreStore } from '@/stores/score-store'

const scoreStore = useScoreStore()

const theme = useTheme()

// single source of truth: is the current theme dark?
const isDark = computed(() => theme.global.current.value.dark)

const currentTheme = computed(() =>
    isDark.value ? { icon: 'mdi-weather-sunny', text: 'Light Theme' } : { icon: 'mdi-weather-night', text: 'Dark Theme' }
)

function toggleTheme() {
    // check once and handle each branch explicitly
    if (isDark.value) {
        theme.change('customLightTheme')
        scoreStore.theme = 'light'
    } else {
        theme.change('customDarkTheme')
        scoreStore.theme = 'dark'
    }
}
</script>

<template>
    <v-list-item @click="toggleTheme" :append-icon="currentTheme.icon"> {{ currentTheme.text }} </v-list-item>
</template>
