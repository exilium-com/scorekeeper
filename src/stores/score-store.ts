import { defineStore } from 'pinia'
import { Round, Player } from '@/types/player'
import { ref } from 'vue'

const VERSION = '0.1'

export const useScoreStore = defineStore('score' + VERSION,
    () => {
        let players = ref<Player[]>([])
        let rounds = ref<Round[]>([])
        let playersTotal = ref<number[]>([])
        let lastPlayerNumber = 1

        function addPlayer() {
            players.value.push({name: '', placeholder: 'Player' + (lastPlayerNumber++)})
            rounds.value.forEach(round => round.scores.push(null))
        }

        function deletePlayer(index: number) {
            players.value.splice(index, 1)
            playersTotal.value.splice(index, 1)
            rounds.value.forEach(round => round.scores.splice(index, 1))
        }

        function deleteAllPlayers() {
            players.value = []
            playersTotal.value = []
            rounds.value = []
            addPlayer()
            addPlayer()
        }

        function restartScores() {
            rounds.value = []
            playersTotal.value = []
        }

        return { players, rounds, playersTotal, addPlayer, deletePlayer, deleteAllPlayers, restartScores }
    },
    {
        persist: true
    }
)
