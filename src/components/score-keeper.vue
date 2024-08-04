<script setup lang="ts">
import { reactive, watch, onBeforeMount, onMounted } from 'vue'
import { useScoreStore } from '@/stores/score-store'
import { isEditing } from '@/edit-mode'
import { Score } from '@/types/player'

const scoreStore = useScoreStore()

let state = reactive({
    autofocus: { round: -1, score: -1 } as { round: number, score: number },
})


watch(() => [scoreStore.rounds, scoreStore.players], () => {
    for (let i = 0; i < scoreStore.players.length; i++) {
        scoreStore.playersTotal[i] = 0
        for (let round of scoreStore.rounds) {
            scoreStore.playersTotal[i] = (scoreStore.playersTotal[i] || 0) + round.scores[i]?.score
        }
        // if all scores in the last round have a value, add a new round
        if (scoreStore.rounds.length == 0 ||
            (scoreStore.rounds.length > 0 && isRoundComplete(scoreStore.rounds[scoreStore.rounds.length - 1]))) {
            scoreStore.rounds.push({
                round: scoreStore.rounds.length + 1,
                scores: Array(scoreStore.players.length).fill({score: null}),
            })
        }

        // if we added an empty round but user is still editing the previous round, remove it
        if (scoreStore.rounds.length > 2 &&
            !isRoundComplete(scoreStore.rounds[scoreStore.rounds.length - 2]) &&
            isRoundEmpty(scoreStore.rounds[scoreStore.rounds.length - 1])) {
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
    let maxScore = Math.max(...scoreStore.rounds[roundIndex].scores.map(score => typeof score.score !== 'number' ? Number.MIN_SAFE_INTEGER : score.score ))
    return scoreStore.rounds[roundIndex].scores[scoreIndex].score === maxScore
}

function isRoundComplete(round: { scores: Score[] }) {
    return round.scores.every(score => typeof score.score === 'number')
}

function isRoundEmpty(round: { scores: Score[] }) {
    return round.scores.every(score => typeof score.score !== 'number')
}

function isWinner(playerIndex: number) {
    if (scoreStore.rounds.length < 2) {
        return false
    }
    let maxScore = Math.max(...scoreStore.playersTotal.map(total => typeof total !== 'number' ? Number.MIN_SAFE_INTEGER : total ))
    return scoreStore.playersTotal[playerIndex] === maxScore
}

function checkDigit(e: KeyboardEvent) {
    if (
        ['Enter', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab'].includes(e.key) ||
        e.ctrlKey
      ) return

    // Only numbers, +, - & . are allowed
    if (!/^[0-9\-+.]+$/.test(e.key)) {
        e.preventDefault()
        console.log('Only numbers, +, - & . are allowed')
      }
}

function checkValidity(e: InputEvent, roundIndex: number, scoreIndex: number) {
    console.log('checkValidity: ', e, e.target.value, e.target.validity.valid)
    const round = scoreStore.rounds[roundIndex]
    if (!e.target.validity.valid) {
        round.scores[scoreIndex].invalid = true
    }
    else if (round.scores[scoreIndex].invalid) {
        round.scores[scoreIndex].invalid = undefined
    }
    console.log('checkValidity', round.scores[scoreIndex])
}

</script>

<template>
    <v-table fixed-header height="80vh" density="comfortable">
        <thead>
            <tr>
                <th>
                    <v-btn density="compact" variant="text" icon="mdi-account-plus-outline" @click="scoreStore.addPlayer"></v-btn>
                </th>
                <th v-for="(_, playerIndex) in scoreStore.players" :key="playerIndex">
                    <v-text-field
                        hide-details hide-spin-buttons reverse single-line
                        class="custom-text-field py-1"
                        density="comfortable"
                        variant="plain"
                        maxlength="15"
                        v-model="scoreStore.players[playerIndex].name" :placeholder="scoreStore.players[playerIndex].placeholder">
                        <template v-slot:append-inner v-if="isEditing">
                            <v-icon icon="mdi-trash-can-outline" size="small" color="primary" @click="scoreStore.deletePlayer(playerIndex)" />
                        </template>
                    </v-text-field>
                </th>
            </tr>
        </thead>


        <tbody>
            <tr v-for="(round, roundIndex) in scoreStore.rounds" :key="roundIndex">
                <td class="round-color d-flex align-center justify-center">{{ scoreStore.rounds.length > 1 ? roundIndex + 1 : "" }}
                        <v-icon v-if="isEditing"
                            icon="mdi-trash-can-outline"
                            size="small"
                            color="primary-darken-1"
                            @click="scoreStore.deleteRound(roundIndex)"
                            :disabled="scoreStore.isRoundEmpty(roundIndex)" />
                </td>
                <td v-for="(score, scoreIndex) in round.scores" :key="scoreIndex">
                    <v-text-field
                        type="number"
                        inputmode=undefined
                        hide-spin-buttons reverse single-line hide-details
                        class="text-right custom-text-field"
                        :class="{ 'winner-color-text-field': isRoundWinner(scoreIndex, roundIndex),
                                  'error-color-text-field': score.invalid?? undefined}"
                        density="compact"
                        :variant="!!score.score ? 'plain' : 'filled'"
                        v-model.number="round.scores[scoreIndex].score"
                        :autofocus="roundIndex == state.autofocus.round && scoreIndex == state.autofocus.score"
                        @keydown="checkDigit"
                        @input="checkValidity($event, roundIndex, scoreIndex)">
                        <!-- {{ `score=${score}` }}
                        {{ typeof score.score }}
                        {{ score.invalid }} -->

                        <template v-slot:prepend-inner>
                            <v-icon color="winner" v-if="isRoundWinner(scoreIndex, roundIndex)" size="small" icon="mdi-star" />
                        </template>
                    </v-text-field>
                </td>
            </tr>
        </tbody>


        <tfoot>
            <tr>
                <td class="text-center"><v-icon icon="mdi-sigma" color="light"/></td>
                <td v-for="(_, index) in scoreStore.playersTotal" :key="index" class="text-right">
                    <v-text-field
                        hide-details hide-spin-buttons reverse single-line
                        :class="'text-right custom-text-field py-1 ' + (isWinner(index) ? 'winner-color-text-field' : '')"
                        type="number"
                        density="compact"
                        variant="plain"
                        v-model.number="scoreStore.playersTotal[index]"
                        readonly>
                        <template v-slot:prepend-inner>
                            <v-icon class="pb-1" color="winner" v-if="isWinner(index)" size="small" icon="mdi-star" />
                        </template>
                    </v-text-field>


                </td>

            </tr>
        </tfoot>
    </v-table>
</template>



<style scoped>

/* Hide the vertical divider between the number input and the decrement button */
.v-number-input /deep/ .v-divider--vertical {
    display: none;
}

tbody {
    background-color: rgb(var(--v-theme-background)) !important;
}

td {
    border: none !important;
}

table>thead>tr>th,
table>tfoot>tr>td {
    padding-left: 8px !important;
    padding-right: 8px !important;
    background-color: rgb(var(--v-theme-secondary)) !important;
    color: #fff;
}

table>tbody>tr>td {
    padding-left: 8px !important;
    padding-right: 8px !important;
}

.custom-text-field /deep/ .v-field__input {
    padding-top: 0px !important;
    padding-bottom: 2px !important;
    text-overflow: ellipsis;
    font-weight: 500;
}

.custom-text-field /deep/ .v-field__prepend-inner {
    padding-top: 5px !important;
}

.custom-text-field /deep/ .v-field__append-inner {
    padding-top: 9px !important;
}

.custom-text-field /deep/ .v-field__prepend-inner > .v-icon {
    opacity: 1.0 !important;
}

.winner-color-text-field /deep/ .v-field__input {
    color: rgb(var(--v-theme-winner)) !important;
}

.error-color-text-field /deep/ .v-field__input {
    color: rgb(var(--v-theme-error)) !important;
}

.round-color {
    color: gray !important;
}
</style>
