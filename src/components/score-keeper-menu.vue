<script setup lang="ts">

import { isSharingSupported, addToHomeScreen } from '@/sharing'
import { useScoreStore } from '@/stores/score-store'
import { RelativeTime } from 'relative-time-vue-component'

const scoreStore = useScoreStore()

function isCurrentGame(gameIndex: number)
{
    return scoreStore.curGame === (scoreStore.gameHistory.length - gameIndex - 1)
}

</script>
<v-btn :disabled="!isSharingSupported" icon="mdi-tray-arrow-down" @click="addToHomeScreen"></v-btn>

<template>
<v-btn id="menu-button">
    <v-icon>mdi-menu</v-icon>
</v-btn>
<v-menu activator="#menu-button">
    <v-list>
        <v-list-item :disabled="!isSharingSupported" @click="addToHomeScreen">
            Add to Home Screen
            <template v-slot:append>
                <v-icon icon="mdi-tray-arrow-down"></v-icon>
            </template>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item @click="scoreStore.newGame">
            New Game
            <template v-slot:append>
                <v-icon icon="mdi-restart"></v-icon>
            </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-subheader title="Games"></v-list-subheader>
        <v-list-item v-for="(game, gameIndex) in scoreStore.gameHistory.slice(-10).reverse()"
            @click="scoreStore.changeGame(scoreStore.gameHistory.length - gameIndex - 1)"
            :active="isCurrentGame(gameIndex)" :key="gameIndex">
            <template v-if="isCurrentGame(gameIndex)" v-slot:append>
                <v-icon icon="mdi-arrow-left"></v-icon>
            </template>
            <v-list-item-title>
                {{ game.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
                <RelativeTime :time="new Date(game.date)" :locale="null"> </RelativeTime>
            </v-list-item-subtitle>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-group value="About">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" title="About" append-icon="mdi-information-outline"></v-list-item>
            </template>
            <v-list-item>
                <v-list-item-title>Score Keeper</v-list-item-title>
                <v-list-item-subtitle>v1.0.0 by <a href="https://exilium.com">exilium</a></v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
                Keep scores for any games, privately. Nothing is sent to any
                server on the cloud unless you explicitly share scores with
                someone. Also works offline (use the menu to add Score
                Keeper to your homescreen).
            </v-list-item>
        </v-list-group>
    </v-list>
</v-menu>
</template>