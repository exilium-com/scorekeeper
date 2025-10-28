<script setup lang="ts">
import { useScoreStore } from '@/stores/score-store'
import { RelativeTime } from 'relative-time-vue-component'
import { computed } from 'vue'

const scoreStore = useScoreStore()

const props = defineProps<{
    start?: number
    end?: number
}>()

const indexedGameHistory = computed(() => {
    return scoreStore.gameHistory.map((game, index) => {
        return { ...game, index }
    })
})
</script>

<template>
    <v-list-item
        v-for="game in indexedGameHistory.slice(props.start, props.end).reverse()"
        @click="scoreStore.changeGame(game.index)"
        :active="game.index === scoreStore.curGame"
        :key="game.index"
    >
        <template v-if="game.index === scoreStore.curGame" v-slot:append>
            <v-icon icon="mdi-arrow-left"></v-icon>
        </template>
        <v-list-item-title>
            {{ game.name }}
        </v-list-item-title>
        <v-list-item-subtitle style="color: rgb(var(--v-theme-primary-darken-1))">
            <RelativeTime :time="new Date(game.date)" :locale="null"> </RelativeTime>
        </v-list-item-subtitle>
    </v-list-item>
</template>
