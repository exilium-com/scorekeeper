import { defineStore } from 'pinia'
import { Round } from '@/types/player'
import { ref } from 'vue'

export const useScoreStore = defineStore('score',
    () => {
        let players = ref<string[]>([])
        let rounds = ref<Round[]>([])
        let playersTotal = ref<number[]>([])

        function addPlayer() {
            players.value.push('player' + (players.value.length + 1))
            rounds.value.forEach(round => round.scores.push(null))
            console.log(players.value, rounds.value, playersTotal.value)
        }

        function deletePlayer(index: number) {
            players.value.splice(index, 1)
            rounds.value.forEach(round => round.scores.splice(index, 1))
            playersTotal.value.splice(index, 1)
        }

        function deleteAllPlayers() {
            players.value = []
            rounds.value.forEach(round => round.scores = [])
            playersTotal.value = []
        }

        return { players, rounds, playersTotal, addPlayer, deletePlayer, deleteAllPlayers }
    },
    {
        persist: true
    }
)