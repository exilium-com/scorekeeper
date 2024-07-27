import { defineStore } from 'pinia'
import { Round, Player } from '@/types/player'
import { ref } from 'vue'

const VERSION = '0.1'

interface ShareableScore {
    p: string[]     // player names
    r: number[][]   // scores for each round for each player
}

export const useScoreStore = defineStore('score' + VERSION,
    () => {
        let players = ref<Player[]>([])
        let rounds = ref<Round[]>([])
        let playersTotal = ref<number[]>([])
        let lastPlayerNumber = 1

        function encodeScores() : string {
            // encode into json
            let scores: ShareableScore = { p: [], r: [] }
            players.value.forEach(player => scores.p.push(player.name))
            rounds.value.forEach(round => scores.r.push(round.scores))
            return btoa(JSON.stringify(scores))
        }

        function decodeScores(scores: string) {
            // decode from json
            let data = JSON.parse(atob(scores))
            players.value = data.p.map((name: string, i: number) => { return { name: name, placeholder: 'Player' + (i + 1) } })
            rounds.value = data.r.map((scores: number[], roundIndex: number) => { return { round: roundIndex, scores: scores } })
            playersTotal.value = players.value.map((_, i) => rounds.value.reduce((total, round) => total + round.scores[i], 0))
            lastPlayerNumber = players.value.length + 1
        }

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

        function deleteRound(index: number) {
            rounds.value.splice(index, 1)
            playersTotal.value = playersTotal.value.map((total, i) => total - rounds.value[index].scores[i])
        }

        function restartScores() {
            rounds.value = []
            playersTotal.value = []
        }

        return { players, rounds, playersTotal, addPlayer, deletePlayer, deleteAllPlayers, restartScores, deleteRound, encodeScores, decodeScores }
    },
    {
        persist: true
    }
)
