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
                <template v-slot:prepend>
                    <v-icon icon="mdi-account"></v-icon>
                </template>
                <template v-slot:append>
                    <v-icon icon="mdi-plus"></v-icon>
                </template>
            </v-list-item>

            <template v-if="scoreStore.players.length > 0">
                <v-divider></v-divider>

                <v-list-item v-for="(player, playerIndex) in scoreStore.players" :key="playerIndex" @click="scoreStore.deletePlayer(playerIndex)">
                    <v-list-item-title>{{ player }}</v-list-item-title>
                    <template v-slot:append>
                        <v-icon icon="mdi-delete-outline"></v-icon>
                    </template>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item @click="scoreStore.deleteAllPlayers()">
                    <template v-slot:prepend>
                        <v-icon icon="mdi-account-multiple"></v-icon>
                    </template>
                    <template v-slot:append>
                        <v-icon icon="mdi-delete-alert-outline" color="red"></v-icon>
                    </template>
                </v-list-item>
            </template>
        </v-list>
    </v-menu>
</template>