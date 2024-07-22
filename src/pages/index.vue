<script lang="ts" setup>
import { ref } from 'vue';
import { Round } from '@/types/player'

const playerNames = ref(['Alice', 'Bob', 'Charlie'])

const rounds = ref<Round[]>([
  { round: 1, scores: [100, -20, 120] },
  { round: 2, scores: [400, 50, 350] },
  { round: 3, scores: [700, 300, 900] },
  { round: 1, scores: [100, -20, 120] },
  { round: 2, scores: [400, 50, 350] },
  { round: 3, scores: [700, 300, 900] },
  { round: 1, scores: [100, -20, 120] },
  { round: 2, scores: [400, 50, 350] },
  { round: 3, scores: [700, 300, 900] },
  { round: 1, scores: [100, -20, 120] },
  { round: 2, scores: [400, 50, 350] },
  { round: 3, scores: [700, 300, 900] },
  { round: 1, scores: [100, -20, 120] },
  { round: 2, scores: [400, 50, 350] },
  { round: 3, scores: [700, 300, 900] },
  { round: 1, scores: [100, -20, 120] },
  { round: 2, scores: [400, 50, 350] },
  { round: 3, scores: [700, 300, 900] },
])


const emptyplayerNames = [] as string[]

const emptyrounds = ref<Round[]>([
])

</script>

<template>
  <ScoreKeeper :players="emptyplayerNames" :rounds="emptyrounds"/>
</template>

