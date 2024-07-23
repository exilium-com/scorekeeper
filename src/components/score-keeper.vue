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
    console.log("autofocus", state.autofocus)
})


</script>

<template>
    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <v-row>
                <v-col cols="12">
                    <v-table  fixed-header height="80vh" density="compact">
                        <thead>
                            <tr>
                                <th>
                                    <v-btn variant="text" icon="mdi-account-plus" @click="scoreStore.addPlayer"></v-btn>
                                </th>
                                <th v-for="(_, playerIndex) in scoreStore.players" :key="playerIndex">
                                    <v-text-field reverse variant="plain" v-model="scoreStore.players[playerIndex]">
                                    </v-text-field>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(round, roundIndex) in scoreStore.rounds" :key="roundIndex">
                                <td>{{ scoreStore.rounds.length > 1 ? round.round : ""  }}</td>
                                <td v-for="(_, scoreIndex) in round.scores" :key="scoreIndex">
                                    <v-text-field reverse class="text-right" density="compact" variant="plain" v-model.number="round.scores[scoreIndex]" :autofocus="roundIndex==state.autofocus.round  &&  scoreIndex==state.autofocus.score"></v-text-field>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><v-avatar><v-icon icon="mdi-sigma"/></v-avatar></td>
                                <td v-for="(total, index) in scoreStore.playersTotal" :key="index" class="text-right">
                                    {{ total }}
                                </td>
                            </tr>
                        </tfoot>
                    </v-table>
                </v-col>
            </v-row>
        </v-responsive>
    </v-container>
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

table,
th,
td {
    border-collapse: collapse;
}

td {
    border: 1px solid #2c5e77;
    border-top: none !important;
    border-bottom: none !important;
}

table > thead > tr > th
{
    background-color: #2c5e77 !important;
    color: #fff;
}
</style>
