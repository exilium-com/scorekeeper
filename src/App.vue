<script lang="ts" setup>
import { useTheme } from 'vuetify'
import { useScoreStore } from './stores/score-store'
import { onMounted } from 'vue';


function setTheme() {
    let lightTheme = true
    const scoreStore = useScoreStore()
    if (scoreStore.theme) {
        lightTheme = scoreStore.theme === "light" ? true : false
    } else {
        if (window.matchMedia) {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                lightTheme = false
            } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
                lightTheme = true
            }
        }
    }

    const theme = useTheme()
    theme.global.name.value = lightTheme ? 'customLightTheme' : 'customDarkTheme'
}

onMounted(() => {
    setTheme()
})

</script>

<template>
  <v-app class="myFont">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
.myFont {
  font-family: 'Roboto Slab', serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}
</style>
