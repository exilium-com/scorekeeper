<script setup lang="ts">

import { isSharingSupported, addToHomeScreen } from '@/sharing'
import { useScoreStore } from '@/stores/score-store'
import ThemeSwitch from '@/components/theme-switch.vue'
import { watch, reactive } from 'vue'

const recentGameMax = 3
const scoreStore = useScoreStore()

let state = reactive({
    openGames: [] as string[]
})

function isCurGameRecent() {
    return scoreStore.curGame >= scoreStore.gameHistory.length - recentGameMax
}

watch(() => scoreStore.curGame, () => {
    state.openGames = isCurGameRecent() ? ["Games"] : ["Games", "More"]
},
    { immediate: true }
)

</script>

<template>
<v-btn :disabled="!isSharingSupported" icon="mdi-tray-arrow-down" @click="addToHomeScreen"></v-btn>

<v-btn id="menu-button">
    <v-icon>mdi-menu</v-icon>
</v-btn>
<v-menu activator="#menu-button">
    <v-list :opened="state.openGames"  min-width="300px">
        <v-list-item @click="scoreStore.newGame">
            New Game
            <template v-slot:append>
                <v-icon icon="mdi-restart"></v-icon>
            </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-group value="Games" >
            <template v-slot:activator="{props}">
                <v-list-item v-bind="props" title="Games">
                </v-list-item>
            </template>
        <GameHistory :start="-recentGameMax" />

        <v-list-group value="More">
            <template v-slot:activator="{props}">
                <v-list-item v-bind="props" title="More...">
                </v-list-item>
            </template>
            <GameHistory :end="-recentGameMax" />
        </v-list-group>
        </v-list-group>
        <v-divider></v-divider>
        <v-list-item :disabled="!isSharingSupported" @click="addToHomeScreen">
            Add to Home Screen
            <template v-slot:append>
                <v-icon icon="mdi-tray-arrow-down"></v-icon>
            </template>
        </v-list-item>
        <ThemeSwitch />
        <v-list-item title="About" append-icon="mdi-information-outline" @click="">
            <AboutDialog/>
        </v-list-item>
    </v-list>
</v-menu>
</template>