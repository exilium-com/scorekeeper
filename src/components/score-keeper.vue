<script setup lang="ts">
import { reactive, watch, onBeforeMount, onMounted } from 'vue';
import { useScoreStore } from '@/stores/score-store'

const scoreStore = useScoreStore()

let state = reactive({
    autofocus: { round:-1, score:-1 } as { round: number, score: number },
})

watch(() => [scoreStore.rounds, scoreStore.players], () => {
    for (let i = 0; i < scoreStore.players.length; i++) {
        scoreStore.playersTotal[i] = 0
        for (let round of scoreStore.rounds) {
            scoreStore.playersTotal[i] = (scoreStore.playersTotal[i] || 0) + round.scores[i]
        }
        // if all scores in the last round have a value, add a new round
        if (scoreStore.rounds.length == 0  ||
            (scoreStore.rounds.length > 0  && scoreStore.rounds[scoreStore.rounds.length - 1].scores.every(score => typeof score === 'number'))) {
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
    for (let roundIndex = 0; roundIndex < scoreStore.rounds.length  &&  !autofocus; roundIndex++) {
        for (let scoreIndex = 0; scoreIndex < scoreStore.rounds[roundIndex].scores.length  &&  !autofocus; scoreIndex++) {
            if (typeof scoreStore.rounds[roundIndex].scores[scoreIndex] !== 'number') {
                autofocus = { round: roundIndex, score: scoreIndex }
            }
        }
    }
    state.autofocus = autofocus ? autofocus : { round: -1, score: -1 }
})


</script>

<template>
    <div class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <v-row>
                <v-col cols="12">
                    <v-table  fixed-header height="80vh" density="compact" class="ma-0 pa-0">
                        <thead>
                            <tr>
                                <th class="text-center">
                                    <v-btn variant="text" icon="mdi-account-plus" @click="scoreStore.addPlayer"></v-btn>
                                </th>
                                <th v-for="(_, playerIndex) in scoreStore.players" :key="playerIndex">
                                    <v-text-field class="custom-text-field py-1" hide-details hide-spin-buttons reverse variant="plain" v-model="scoreStore.players[playerIndex].name" :placeholder="scoreStore.players[playerIndex].placeholder">
                                    </v-text-field>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(round, roundIndex) in scoreStore.rounds" :key="roundIndex">
                                <td class="text-center" style="color:#5c8ea7 ;">{{ scoreStore.rounds.length > 1 ? round.round : ""  }}</td>
                                <td v-for="(score, scoreIndex) in round.scores" :key="scoreIndex">
                                    <v-text-field class="text-right custom-text-field py-1" type="number" hide-details hide-spin-buttons reverse single-line density="compact" :variant="typeof score === 'number' ? 'plain' : 'underlined'" placeholder="0" v-model.number="round.scores[scoreIndex]" :autofocus="roundIndex==state.autofocus.round  &&  scoreIndex==state.autofocus.score"></v-text-field>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td class="text-center"><v-avatar><v-icon icon="mdi-sigma"/></v-avatar></td>
                                <td v-for="(total, index) in scoreStore.playersTotal" :key="index" class="text-right">
                                    {{ total }}
                                </td>
                            </tr>
                        </tfoot>
                    </v-table>
                </v-col>
            </v-row>
        </v-responsive>
    </div>
</template>

<style scoped>
thead,
tfoot {
    background-color: #2c5e77 !important;
    color: #fff;
}

tbody {
    background-color: #333;
}

td {
    border-width: 1px;
    border-color: #2c5e77 !important;
    border-right-style: solid;
}

table > thead > tr > th, table > tfoot > tr > td
{
    padding: 0 4px !important;
    background-color: #2c5e77 !important;
    color: #fff;
}

table > tbody > tr > td {
    padding: 0 4px !important;
}

.custom-text-field /deep/ .v-field__input { padding: 0; }

</style>
