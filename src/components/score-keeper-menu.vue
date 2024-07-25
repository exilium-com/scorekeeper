<script setup lang="ts">

import { isSharingSupported, addToHomeScreen } from '@/sharing'

import { useScoreStore } from '@/stores/score-store'
const scoreStore = useScoreStore()

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

            <template v-if="scoreStore.rounds.length > 1">
                <v-divider></v-divider>
                <v-list-item @click="scoreStore.restartScores">
                    Reset Scores
                    <template v-slot:append>
                        <v-icon icon="mdi-restart"></v-icon>
                    </template>
                </v-list-item>
            </template>
        </v-list>
    </v-menu>
</template>