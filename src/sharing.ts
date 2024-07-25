
import { ref } from 'vue'
import { isClient } from '@vueuse/shared'
import { useShare } from '@vueuse/core'
import { useScoreStore } from '@/stores/score-store'
import * as htmlToImage from 'html-to-image';
import { type Round, type Player } from '@/types/player'


const scoreStore = useScoreStore()

let sharingOptions = ref({
    title: 'Score Keeper',
    text: 'Current Scores',
    url: isClient ? location.href : '',
    files: [] as File[],
})

export const { share, isSupported: isSharingSupported } = useShare(sharingOptions)

const addToHomeScreenInstance = new window.AddToHomeScreen({
    appName: 'Score Keeper',
    appIconUrl: 'apple-touch-icon.png',
    assetUrl: 'https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@1.8/dist/assets/img/',
    showErrorMessageForUnsupportedBrowsers: window.AddToHomeScreen.SHOW_ERRMSG_UNSUPPORTED.ALL,
  })

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

function updateSharingScreenshot(scoreHtmlRef: any)
{
  console.log('updateSharingScreenshot')
  htmlToImage.toPng(scoreHtmlRef.value)
    .then(function (dataUrl: string)
    {
      sharingOptions.value.files = [dataURLtoFile(dataUrl, 'scorekeeper.png')];
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

  sharingOptions.value.text = text + '\n'
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

  sharingOptions.value.files = [dataURLtoFile(`data:text/html;base64,${btoa(html)}`, 'scorekeeper.html')];

  console.log('updateSharingHtml done')
}

export function startShare(scoreHtmlRef: any)
{
  console.log('startShare')
  updateSharingText()
  updateSharingHtml()
  try {
    updateSharingScreenshot(scoreHtmlRef)
  } catch (error) {
    // ignore error
  }
  share().catch(err => err)
  console.log('startShare done')
}

export function addToHomeScreen()
{
  addToHomeScreenInstance.show()  // show "add-to-homescreen" instructions to user, or do nothing if already added to homescreen
  // The only argument is the language to show the messages in (currently only 'de', 'en', 'pt' and 'fr' are available).
}
