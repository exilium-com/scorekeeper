<script setup lang="ts">
import { reactive, watch, onBeforeMount, onMounted, computed } from 'vue';
import { useScoreStore } from '@/stores/score-store'
import { sendAnalyticsEvent } from '@/analytics'

const scoreStore = useScoreStore()

let state = reactive({
    autofocus: { round: -1, score: -1 } as { round: number, score: number },
    editPlayers: false,
})

watch(() => [scoreStore.rounds, scoreStore.players], () => {
    for (let i = 0; i < scoreStore.players.length; i++) {
        scoreStore.playersTotal[i] = 0
        for (let round of scoreStore.rounds) {
            scoreStore.playersTotal[i] = (scoreStore.playersTotal[i] || 0) + round.scores[i]
        }
        // if all scores in the last round have a value, add a new round
        if (scoreStore.rounds.length == 0 ||
            (scoreStore.rounds.length > 0 && scoreStore.rounds[scoreStore.rounds.length - 1].scores.every(score => typeof score === 'number'))) {
            scoreStore.rounds.push({
                round: scoreStore.rounds.length + 1,
                scores: Array(scoreStore.players.length).fill(null),
            })
        }

        // if we added an empty round but user is still editing the previous round, remove it
        if (scoreStore.rounds.length > 2 &&
            !scoreStore.rounds[scoreStore.rounds.length - 2].scores.every(score => typeof score === 'number') &&
            scoreStore.rounds[scoreStore.rounds.length - 1].scores.every(score => typeof score !== 'number')) {
            scoreStore.rounds.pop()
        }
    }
},
    {
        immediate: true,
        deep: true
    },
)


onBeforeMount(() => {
    if (scoreStore.players.length === 0) {
        scoreStore.addPlayer()
        scoreStore.addPlayer()
    }
})

onMounted(() => {
    let autofocus = null
    for (let roundIndex = 0; roundIndex < scoreStore.rounds.length && !autofocus; roundIndex++) {
        for (let scoreIndex = 0; scoreIndex < scoreStore.rounds[roundIndex].scores.length && !autofocus; scoreIndex++) {
            if (typeof scoreStore.rounds[roundIndex].scores[scoreIndex] !== 'number') {
                autofocus = { round: roundIndex, score: scoreIndex }
            }
        }
    }
    state.autofocus = autofocus ? autofocus : { round: -1, score: -1 }
})

function isRoundWinner(scoreIndex: number, roundIndex: number) {
    if (scoreStore.rounds.length < 1) {
        return false
    }
    if (scoreStore.rounds[roundIndex].scores.every(score => typeof score === 'number')) {
        let maxScore = Math.max(...scoreStore.rounds[roundIndex].scores)
        return scoreStore.rounds[roundIndex].scores[scoreIndex] === maxScore
    }
    else {
        return false
    }
}


function isWinner(playerIndex: number) {
    if (scoreStore.rounds.length < 2) {
        return false
    }
    if (scoreStore.playersTotal.every(score => typeof score === 'number')) {
        let maxScore = Math.max(...scoreStore.playersTotal)
        return scoreStore.playersTotal[playerIndex] === maxScore
    }
    else {
        return false
    }
}

function editGame() {
    state.editPlayers = !state.editPlayers
    if (state.editPlayers) {
        sendAnalyticsEvent('edit_game')
    }
}

let firstColumnStyle = computed(() => state.editPlayers ? 'width: 120px;' : 'width: 60px;')

</script>

<template>
    <v-table fixed-header height="80vh" density="compact" class="pa-0">
        <thead>
            <tr>
                <th :style="firstColumnStyle" class="text-left">
                    <v-btn :variant="state.editPlayers ? 'tonal' : 'plain'" icon="mdi-pencil" @click="editGame()" :active="state.editPlayers"></v-btn>
                    <v-btn v-if="state.editPlayers" variant="text" icon="mdi-account-plus-outline" @click="scoreStore.addPlayer"></v-btn>
                </th>
                <th v-for="(_, playerIndex) in scoreStore.players" :key="playerIndex">
                    <v-text-field class="custom-text-field py-1" hide-details hide-spin-buttons reverse :variant="state.editPlayers ? 'underlined' : 'plain'"
                         v-model="scoreStore.players[playerIndex].name" :placeholder="scoreStore.players[playerIndex].placeholder">
                        <template v-slot:append-inner v-if="state.editPlayers">
                            <v-icon icon="mdi-trash-can-outline" size="small" color="primary" @click="scoreStore.deletePlayer(playerIndex)" />
                        </template>
                    </v-text-field>
                </th>
                <!-- <th v-if="state.editPlayers" class="text-center">
                            <v-btn variant="text" icon="mdi-account-plus-outline" @click="scoreStore.addPlayer"></v-btn>
                        </th> -->
            </tr>
        </thead>


        <tbody>
            <tr v-for="(round, roundIndex) in scoreStore.rounds" :key="roundIndex">
                <td class="text-left round-color" style="text-indent: 1em">{{ scoreStore.rounds.length > 1 ? roundIndex + 1 : "" }}
                    <v-icon v-if="state.editPlayers && !scoreStore.isRoundEmpty(roundIndex)" icon="mdi-trash-can-outline" size="small" color="primary-darken-1"
                        @click="scoreStore.deleteRound(roundIndex)" />
                </td>
                <td v-for="(score, scoreIndex) in round.scores" :key="scoreIndex">
                    <v-text-field :class="'text-right custom-text-field py-1 ' + (isRoundWinner(scoreIndex, roundIndex) ? 'winner-color-text-field' : '')" type="number"
                        hide-details hide-spin-buttons reverse single-line density="compact" :variant="typeof score === 'number' ? 'plain' : 'underlined'" placeholder="—"
                        v-model.number="round.scores[scoreIndex]" :autofocus="roundIndex == state.autofocus.round && scoreIndex == state.autofocus.score">
                        <template v-slot:prepend-inner>
                            <v-icon class="pb-2" color="success" v-if="isRoundWinner(scoreIndex, roundIndex)" size="small" icon="mdi-star" />
                        </template>
                    </v-text-field>
                </td>
            </tr>
        </tbody>


        <tfoot>
            <tr>
                <td :style="firstColumnStyle" class="text-left"><v-avatar><v-icon icon="mdi-sigma" color="light"/></v-avatar></td>
                <td v-for="(_, index) in scoreStore.playersTotal" :key="index" class="text-right">
                    <v-text-field :class="'text-right custom-text-field py-1 ' + (isWinner(index) ? 'winner-color-text-field' : '')" type="number" hide-details hide-spin-buttons
                        reverse single-line density="compact" variant="plain" v-model.number="scoreStore.playersTotal[index]" readonly>
                        <template v-slot:prepend-inner>
                            <v-icon class="pb-2" color="success" v-if="isWinner(index)" size="small" icon="mdi-star" />
                        </template>
                    </v-text-field>


                </td>

            </tr>
        </tfoot>
    </v-table>
</template>



<style scoped>
tbody {
    background-color: rgb(var(--v-theme-background)) !important;
}

td {
    border: none !important;
}

table>thead>tr>th,
table>tfoot>tr>td {
    padding: 0 8px !important;
    background-color: rgb(var(--v-theme-secondary)) !important;
    color: #fff;
}

table>tbody>tr>td {
    padding: 0 8px !important;
}

.custom-text-field /deep/ .v-field__input {
    padding: 0;
    text-overflow: ellipsis;
    font-weight: 500;
}

.custom-text-field /deep/ .v-field__append-inner {
    padding-top: 14px !important;
}

.winner-color-text-field /deep/ .v-field__input {
    color: rgb(var(--v-theme-success)) !important;
}

.round-color {
    color: gray !important;
}
</style>
