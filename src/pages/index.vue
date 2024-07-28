<script lang="ts" setup>
import { isSharingSupported, startShare } from '@/sharing'
import { watch, onBeforeMount } from 'vue';
import { useScoreStore } from '@/stores/score-store'
import { useRoute, useRouter } from 'vue-router';

const scoreStore = useScoreStore()
const route = useRoute()
const router = useRouter()


watch(() => [scoreStore.players, scoreStore.rounds], () => {
    scoreStore.encodeScores()
    router.replace({ query: { scores: scoreStore.currentEncodedScores() } })
    },
    { deep: true }
)

onBeforeMount(() => {
    if (route.query.scores &&  route.query.scores !== scoreStore.currentEncodedScores()) {
        scoreStore.newGame()
        scoreStore.decodeScores(route.query.scores as string)
    }
})

</script>

<template>
    <v-app-bar density="comfortable">
        <template v-slot:title class="">
            <span class="text-primary font-weight-bold">Score Keeper</span>
        </template>
        <v-btn :disabled="!isSharingSupported" @click="startShare('scoreKeeperId')" icon="mdi-share-variant"></v-btn>
        <ScoreKeeperMenu />
    </v-app-bar>
    <div class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
            <div id="scoreKeeperId">
                <ScoreKeeper />
            </div>
        </v-responsive>
    </div>
</template>