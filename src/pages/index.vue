<script lang="ts" setup>
import { ref } from 'vue';
import { type Round, type Player } from '@/types/player'
import { useScoreStore } from '@/stores/score-store'

import { isClient } from '@vueuse/shared'
import { useShare } from '@vueuse/core'
import * as htmlToImage from 'html-to-image';

const options = ref({
  title: 'Score Keeper',
  text: 'Current Scores',
  url: isClient ? location.href : '',
  files: [] as File[],
})

const scoreStore = useScoreStore()

const { share, isSupported: isSharingSupported } = useShare(options)
// const isSharingSupported = true // HACK

const scoreHtmlRef = ref()


function dataURLtoFile(dataurl: string, filename: string)
{
  var arr = dataurl.split(","),
    mimeType = arr[0].match(/:(.*?);/)[1],
    decodedData = atob(arr[1]),
    lengthOfDecodedData = decodedData.length,
    u8array = new Uint8Array(lengthOfDecodedData);
  while (lengthOfDecodedData--)
  {
    u8array[lengthOfDecodedData] = decodedData.charCodeAt(lengthOfDecodedData);
  }
  return new File([u8array], filename, { type: mimeType });
};

function updateSharingScreenshot()
{
  console.log('updateSharingScreenshot')
  htmlToImage.toPng(scoreHtmlRef.value)
    .then(function (dataUrl: string)
    {
      options.value.files = [dataURLtoFile(dataUrl, 'scorekeeper.png')];
      console.log('updateSharingScreenshot done')
    })
    .catch(function (error: any)
    {
      console.error('updateSharingScreenshot error:', error);
    });
}

function updateSharingText()
{
  console.log('updateSharingText')

  // scoreStore.players has the player names and scoreStore.rounds has the array of rounds with the scores
  // for each player, we print the name, then the score for each round separated by +, then the total score
  const text = scoreStore.players.map((player: Player, playerIndex: number) =>
  {
    const playerTotal = scoreStore.rounds.reduce((total: number, round: Round) => total + (round.scores[playerIndex] || 0), 0)
    return `${player.name || player.placeholder}: ${scoreStore.rounds.map((round: Round) => round.scores[playerIndex] || 0).join(' + ')} = ${playerTotal}`
  }).join('\n')

  options.value.text = text + '\n'
  console.log('updateSharingText done')
}

function updateSharingHtml()
{
  console.log('updateSharingHtml')
  // we export this as a simple html table with the player names and totals bolded and the scores in a table
  const html = `
  <html>
  <head>
  <style>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: center;
  }
  </style>
  </head>
  <body>
  <table>
  <tr>
  <th>Player</th>
  ${scoreStore.rounds.map((round: Round, roundIndex: number) => `<th>Round ${roundIndex + 1}</th>`).join('')}
  <th>Total</th>
  </tr>
  ${scoreStore.players.map((player: Player, playerIndex: number) => `<tr><td><b>${player.name || player.placeholder}</b></td>${scoreStore.rounds.map((round: Round) => `<td>${round.scores[playerIndex] || 0}</td>`).join('')}<td><b>${scoreStore.rounds.reduce((total: number, round: Round) => total + (round.scores[playerIndex] || 0), 0)}</b></td></tr>`).join('')}
  </table>
  </body>
  </html>
  `

  options.value.files = [dataURLtoFile(`data:text/html;base64,${btoa(html)}`, 'scorekeeper.html')];

  console.log('updateSharingHtml done')
}

function startShare()
{
  console.log('startShare')
  updateSharingText()
  updateSharingHtml()
  try {
    updateSharingScreenshot()
  } catch (error) {
    // ignore error
  }
  share().catch(err => err)
  console.log('startShare done')
}

const addToHomeScreenInstance = new window.AddToHomeScreen({
    appName: 'Score Keeper',
    appIconUrl: 'apple-touch-icon.png',
    assetUrl: 'https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@1.8/dist/assets/img/',
    showErrorMessageForUnsupportedBrowsers: window.AddToHomeScreen.SHOW_ERRMSG_UNSUPPORTED.ALL,
  })

function addToHomeScreen()
{
  addToHomeScreenInstance.show()  // show "add-to-homescreen" instructions to user, or do nothing if already added to homescreen
  // The only argument is the language to show the messages in (currently only 'de', 'en', 'pt' and 'fr' are available).
}

</script>

<template>
   <v-app-bar density="comfortable" title="Score Keeper">
      <v-btn :disabled="!isSharingSupported" @click="startShare" icon="mdi-share-variant"></v-btn>
      <v-btn :disabled="!isSharingSupported" icon="mdi-tray-arrow-down" @click="addToHomeScreen"></v-btn>
      <ScoreKeeperMenu/>
   </v-app-bar>
   <div ref="scoreHtmlRef">
   <ScoreKeeper/>
  </div>
</template>

