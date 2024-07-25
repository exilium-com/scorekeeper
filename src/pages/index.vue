<script lang="ts" setup>
import { isSharingSupported, startShare } from '@/sharing'


</script>

<template>
    <v-app-bar density="comfortable">
        <template v-slot:title class="">
            <span class="text-primary">Score Keeper</span>
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
