<script setup lang="ts">
import { defineProps, computed, reactive, watch, onBeforeMount } from 'vue';
import { PropType } from 'vue';
import { Round } from '@/types/player'

const props = defineProps({
    players: {
        type: Array as PropType<string[]>,
        required: true,
    },
    rounds: {
        type: Array as PropType<Round[]>,
        required: true,
    },
})

let state = reactive({
    players: props.players,
    rounds: props.rounds,
    playerTotal: [] as number[],
})

watch(() => (state.rounds, state.players), () => {
    console.log('watch', state.rounds, state.players, state.playerTotal)
    for (let i = 0; i < state.players.length; i++) {
        state.playerTotal[i] = 0
        for (let round of state.rounds) {
            state.playerTotal[i] = (state.playerTotal[i] || 0) + round.scores[i]
        }
        // if all scores in the last round have a value, add a new round
        if (state.rounds.length == 0)
        {
            console.log("watch boolean false")
        }
        else
        {
            console.log(state.rounds[state.rounds.length - 1].scores)
            console.log("watch boolean", state.rounds.length > 0,  state.rounds[state.rounds.length - 1].scores.every(score => typeof score === 'number'))
        }
        if (state.rounds.length == 0  ||
            (state.rounds.length > 0  && state.rounds[state.rounds.length - 1].scores.every(score => typeof score === 'number'))) {
            state.rounds.push({
                round: state.rounds.length + 1,
                scores: Array(state.players.length).fill(null),
            })
        }

        // if we added an empty round but user is still editing the previous round, remove it
        if (state.rounds.length > 2 &&
            !state.rounds[state.rounds.length - 2].scores.every(score => typeof score === 'number') &&
            state.rounds[state.rounds.length - 1].scores.every(score => typeof score !== 'number')) {
            state.rounds.pop()
        }
    }
},
    {
        immediate: true,
        deep: true
    },
)

onBeforeMount(() => {
    if (state.players.length === 0) {
        addPlayer()
        addPlayer()
    }
})

function addPlayer() {
    state.players.push('player' + (state.players.length + 1))
    state.rounds.forEach(round => round.scores.push(null))
    console.log(state.players, state.rounds, state.playerTotal)
}

function deletePlayer(index: number) {
    state.players.splice(index, 1)
    state.rounds.forEach(round => round.scores.splice(index, 1))
    state.playerTotal.splice(index, 1)
}

function deleteAllPlayers() {
    state.players = []
    state.rounds.forEach(round => round.scores = [])
    state.playerTotal = []
}

</script>

<template>
    <v-app-bar density="comfortable" title="Score Keeper">
        <v-btn id="menu-button">
            <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-menu activator="#menu-button">
            <v-list>
                <v-list-item @click="addPlayer">
                    <template v-slot:prepend>
                        <v-icon icon="mdi-account"></v-icon>
                    </template>
                    <template v-slot:append>
                        <v-icon icon="mdi-plus"></v-icon>
                    </template>
                </v-list-item>

                <template v-if="state.players.length > 0">
                    <v-divider></v-divider>

                    <v-list-item v-for="(player, playerIndex) in state.players" :key="playerIndex" @click="deletePlayer(playerIndex)">
                        <v-list-item-title>{{ player }}</v-list-item-title>
                        <template v-slot:append>
                            <v-icon icon="mdi-delete-outline"></v-icon>
                        </template>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item @click="deleteAllPlayers()">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-account-multiple"></v-icon>
                        </template>
                        <template v-slot:append>
                            <v-icon icon="mdi-delete-alert-outline" color="red"></v-icon>
                        </template>
                    </v-list-item>
                </template>
            </v-list>
        </v-menu>
    </v-app-bar>

    <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <v-row>
                <v-col cols="12">
                    <v-table  fixed-header height="80vh" density="compact">
                        <thead>
                            <tr>
                                <th>
                                    <v-btn variant="text" icon="mdi-account-plus" @click="addPlayer"></v-btn>
                                </th>
                                <th v-for="(player, playerIndex) in state.players" :key="playerIndex">
                                    <v-text-field reverse variant="plain" v-model="state.players[playerIndex]">
                                    </v-text-field>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(round, roundIndex) in state.rounds" :key="roundIndex">
                                <td>{{ state.rounds.length > 1 ? round.round : ""  }}</td>
                                <td v-for="(score, scoreIndex) in round.scores" :key="scoreIndex">
                                    <v-text-field reverse class="text-right" density="compact" variant="plain" v-model.number="round.scores[scoreIndex]"></v-text-field>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><v-avatar><v-icon icon="mdi-sigma"/></v-avatar></td>
                                <td v-for="(total, index) in state.playerTotal" :key="index" class="text-right">
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
