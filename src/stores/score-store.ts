import { defineStore } from 'pinia'
import { Round, Player, Score } from '@/types/player'
import { ref } from 'vue'
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { sendAnalyticsEvent } from '@/analytics'

const VERSION = '0.142'

interface ShareableScore {
    p: string[]     // player names
    r: number[][]   // scores for each round for each player
}

export const useScoreStore = defineStore('score' + VERSION,
    () => {
        const players = ref<Player[]>([])
        const rounds = ref<Round[]>([])
        const playersTotal = ref<number[]>([])
        let lastPlayerNumber = ref(1)
        const gameHistory = ref<{ date: Date, name: string, encodedScores: string }[]>([{date: new Date(), name: 'new game', encodedScores: ''}])
        const curGame = ref(0)
        const theme = ref('dark')

        function encodeScores() {
            // encode into json
            const scores: ShareableScore = { p: [], r: [] }
            players.value.forEach((player: Player) => scores.p.push(player.name))
            rounds.value.forEach((round: Round) => scores.r.push(round.scores.map((score: Score) => score.score)))
            const json = JSON.stringify(scores)
            // console.log(json.length, btoa(json).length, compressToEncodedURIComponent(json).length)
            gameHistory.value[curGame.value].encodedScores = compressToEncodedURIComponent(json)
        }

        function currentEncodedScores() : string {
            return gameHistory.value[curGame.value].encodedScores
        }

        function decodeScores(encodedScores: string) {
            // decode from json
            const data = JSON.parse(decompressFromEncodedURIComponent(encodedScores))
            players.value = data.p.map((name: string, i: number) => { return { name: name, placeholder: 'Player' + (i + 1) } })
            rounds.value = data.r.map((scores: number[], roundIndex: number) => { return { round: roundIndex, scores: scores.map((score: number) => { return { score: score } }) } })
            playersTotal.value = players.value.map((_, i) => rounds.value.reduce((total, round) => total + round.scores[i].score, 0))
            lastPlayerNumber.value = players.value.length + 1
        }

        function addPlayer() {
            players.value.push({name: '', placeholder: 'Player' + (lastPlayerNumber.value++)})
            rounds.value.forEach(round => round.scores.push({score: null}))
        }

        function deletePlayer(index: number) {
            players.value.splice(index, 1)
            playersTotal.value.splice(index, 1)
            rounds.value.forEach(round => round.scores.splice(index, 1))
            if (players.value.length === 0) {
                addPlayer()
            }
        }

        function deleteAllPlayers() {
            players.value = []
            playersTotal.value = []
            rounds.value = []
            addPlayer()
            addPlayer()
        }

        function addRound() {
            rounds.value.push({
                round: rounds.value.length + 1,
                scores: Array.from({ length: players.value.length }, _ => ({score: null})),
            })

        }

        function deleteRound(index: number) {
            rounds.value.splice(index, 1)
            playersTotal.value = playersTotal.value.map((_, i) => rounds.value.reduce((total, round) => total + round.scores[i]?.score, 0))
        }

        function saveCurrentGame() {
            const gameName =  players.value.map((player: Player) => player.name ? player.name : player.placeholder).join(' vs ')
            gameHistory.value[curGame.value].name = gameName
            encodeScores()
        }

        function isRoundEmpty(roundIndex: number) {
            return rounds.value[roundIndex].scores.every(score => typeof score.score !== 'number')
        }

        function isRoundComplete(roundIndex: number) {
            return rounds.value[roundIndex].scores.every(score => typeof score.score === 'number')
        }

        function newGame() {
            sendAnalyticsEvent('new_game')
            saveCurrentGame()
            rounds.value = []
            playersTotal.value = []
            curGame.value = gameHistory.value.length
            gameHistory.value.push({ date: new Date(), name: "Game" + curGame.value, encodedScores: "" })
        }

        function changeGame(index: number) {
            sendAnalyticsEvent('change_game')
            saveCurrentGame()
            curGame.value = index
            decodeScores(gameHistory.value[curGame.value].encodedScores)
        }

        return { players, rounds, playersTotal, curGame, addPlayer, deletePlayer, deleteAllPlayers, newGame, addRound, deleteRound, encodeScores, decodeScores, changeGame, gameHistory, currentEncodedScores, isRoundEmpty, isRoundComplete, theme }
    },
    {
        persist: true
    }
)
