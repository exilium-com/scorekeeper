<script lang="ts" setup>
import { ref } from 'vue';
import { isSharingSupported, startShare } from '@/sharing'


// const isSharingSupported = true // HACK

const scoreHtmlRef = ref()


</script>

<template>
   <v-app-bar density="comfortable">
      <template v-slot:title class="">
          <span class="text-primary">Score Keeper</span>
      </template>
      <v-btn :disabled="!isSharingSupported" @click="startShare" icon="mdi-share-variant"></v-btn>
      <ScoreKeeperMenu/>
   </v-app-bar>
   <div ref="scoreHtmlRef">
   <ScoreKeeper/>
  </div>
</template>

