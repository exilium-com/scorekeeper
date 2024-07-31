<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify'
import { useScoreStore } from '@/stores/score-store'

const scoreStore = useScoreStore()

const theme = useTheme()

const currentTheme = computed(() => theme.global.name.value === 'customDarkTheme'
    ? {icon: 'mdi-weather-sunny', text: 'Light Theme'}
    : {icon: 'mdi-weather-night', text: 'Dark Theme'}
  )

function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'customLightTheme' : 'customDarkTheme'
    scoreStore.theme = theme.global.name.value === 'customDarkTheme' ? 'dark' : 'light'
}
</script>

<template >
<v-list-item @click="toggleTheme" :append-icon="currentTheme.icon"> {{ currentTheme.text }} </v-list-item>
</template>
