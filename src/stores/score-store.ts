import { defineStore } from 'pinia'
import { Round, Player } from '@/types/player'
import { ref, Ref } from 'vue'

const VERSION = '0.11'

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
        let gameHistory = ref<{ date: Date, name: string, encodedScores: string }[]>([{date: new Date(), name: 'new game', encodedScores: ''}])
        let curGame = ref(0)


        function encodeScores() {
            // encode into json
            let scores: ShareableScore = { p: [], r: [] }
            players.value.forEach(player => scores.p.push(player.name))
            rounds.value.forEach(round => scores.r.push(round.scores))
            gameHistory.value[curGame.value].encodedScores = btoa(JSON.stringify(scores))
        }

        function currentEncodedScores() : string {
            return gameHistory.value[curGame.value].encodedScores
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

        function saveCurrentGame() {
            console.log('saveCurrentGame - curGame = ', curGame.value)
            let gameName =  players.value.map(player => player.name ? player.name : player.placeholder).join(' vs ')
            gameHistory.value[curGame.value].name = gameName
            encodeScores()
        }

        function isRoundEmpty(roundIndex: number) {
            return rounds.value[roundIndex].scores.every(score => typeof score !== 'number')
        }

        function newGame() {
            saveCurrentGame()
            rounds.value = []
            playersTotal.value = []
            curGame.value = gameHistory.value.length
            gameHistory.value.push({ date: new Date(), name: "Game" + curGame.value, encodedScores: "" })
        }

        function changeGame(index: number) {
            saveCurrentGame()
            console.log("changeGame - from = ", curGame.value, " to =", index, " length=", gameHistory.value.length)
            curGame.value = index
            decodeScores(gameHistory.value[curGame.value].encodedScores)
        }

        return { players, rounds, playersTotal, curGame, addPlayer, deletePlayer, deleteAllPlayers, newGame, deleteRound, encodeScores, decodeScores, changeGame, gameHistory, currentEncodedScores, isRoundEmpty }
    },
    {
        persist: true
    }
)
