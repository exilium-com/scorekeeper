<script setup lang="ts">

import { useScoreStore } from '@/stores/score-store'

const scoreStore = useScoreStore()

</script>

<template>
    <v-btn id="menu-button">
        <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-menu activator="#menu-button">
        <v-list>
            <v-list-item @click="scoreStore.addPlayer">
                Add Player
                <template v-slot:append>
                    <v-icon icon="mdi-account-plus"></v-icon>
                </template>
            </v-list-item>

            <template v-if="scoreStore.players.length > 0">
                <v-divider></v-divider>

                <v-list-item v-for="(player, playerIndex) in scoreStore.players" :key="playerIndex" @click="scoreStore.deletePlayer(playerIndex)">
                    <v-list-item-title>{{ player.name ? 'Remove ' + player.name : 'Remove ' + player.placeholder }}</v-list-item-title>
                    <template v-slot:append>
                        <v-icon icon="mdi-account-remove"></v-icon>
                    </template>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item @click="scoreStore.restartScores">
                    Restart Scores
                    <template v-slot:append>
                        <v-icon icon="mdi-restart"></v-icon>
                    </template>
                </v-list-item>

                <v-list-item @click="scoreStore.deleteAllPlayers()">
                    Delete All Players
                    <template v-slot:append>
                        <v-icon icon="mdi-account-multiple-remove"></v-icon>
                    </template>
                </v-list-item>
            </template>
        </v-list>
    </v-menu>
</template>