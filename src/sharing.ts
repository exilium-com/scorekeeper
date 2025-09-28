import { ref } from "vue";
import { isClient } from "@vueuse/shared";
import { useShare } from "@vueuse/core";
import { useScoreStore } from "@/stores/score-store";
import * as htmlToImage from "html-to-image";
import { type Round, type Player } from "@/types/player";
import { sendAnalyticsEvent } from "@/analytics";

const scoreStore = useScoreStore();

let sharingOptions = ref({
  title: "Score Keeper",
  text: "Current Scores",
  url: isClient ? location.href : "",
  //    files: [] as File[],
});

export const { share, isSupported: isSharingSupported } =
  useShare(sharingOptions);

const addToHomeScreenInstance = new window.AddToHomeScreen({
  appName: "Score Keeper",
  appIconUrl: "apple-touch-icon.png",
  assetUrl:
    "https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@1.8/dist/assets/img/",
  showErrorMessageForUnsupportedBrowsers:
    window.AddToHomeScreen.SHOW_ERRMSG_UNSUPPORTED.ALL,
});

function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "";
  const decodedData = atob(arr[1]);
  let lengthOfDecodedData = decodedData.length;
  const u8array = new Uint8Array(lengthOfDecodedData);
  while (lengthOfDecodedData--) {
    u8array[lengthOfDecodedData] = decodedData.charCodeAt(lengthOfDecodedData);
  }
  return new File([u8array], filename, { type: mimeType });
}

async function updateSharingScreenshot(elementId: string) {
  const node = document.getElementById("scoreKeeperId");
  if (!node) {
    console.error("updateSharingScreenshot: node not found");
    return;
  }
  console.log("updateSharingScreenshot");
  const dataUrl = await htmlToImage.toPng(node, {
    height: 300,
    canvasHeight: 300,
    pixelRatio: 0.5,
  });
  sharingOptions.value.files.push(dataURLtoFile(dataUrl, "scorekeeper.png"));
  console.log("updateSharingScreenshot done");
}

function updateSharingText() {
  const filledRounds = scoreStore.rounds.filter(
    (_, roundIndex: number) => !scoreStore.isRoundEmpty(roundIndex)
  );

  // scoreStore.players has the player names and scoreStore.rounds has the array of rounds with the scores
  // for each player, we print the name, then the score for each round separated by +, then the total score
  const text = scoreStore.players
    .map((player: Player, playerIndex: number) => {
      const playerTotal = scoreStore.rounds.reduce(
        (total: number, round: Round) =>
          total + (round.scores[playerIndex].score || 0),
        0
      );
      return `${player.name || player.placeholder}: ${
        filledRounds.length === 1
          ? ""
          : filledRounds
              .map(
                (round: Round, roundIndex: number) =>
                  round.scores[playerIndex].score || 0
              )
              .join(" + ") + " ="
      } ${playerTotal}`;
    })
    .join("\n");

  sharingOptions.value.text = text + "\n";
}

function getPlayerScoresHtml(round: Round) {
  return scoreStore.players
    .map(
      (player: Player, playerIndex: number) =>
        `<td>${round.scores[playerIndex].score || 0}</td>`
    )
    .join("");
}

function updateSharingHtml() {
  console.log("updateSharingHtml");
  const playerHeader =
    `<tr><th><b> Rounds\\Players </b></th>` +
    scoreStore.players
      .map(
        (player: Player, playerIndex: number) =>
          `<th>${player.name || player.placeholder}</th>`
      )
      .join("") +
    "</tr>";
  const filledRounds = scoreStore.rounds.filter(
    (_, roundIndex: number) => !scoreStore.isRoundEmpty(roundIndex)
  );
  const playerScores = filledRounds
    .map(
      (round: Round, roundIndex: number) =>
        `<tr><td><b>Round ${roundIndex + 1}</b></td> ${getPlayerScoresHtml(
          round
        )} </tr>`
    )
    .join("");
  const playerTotals =
    "<tr><td><b> Totals </b></td>" +
    scoreStore.players
      .map(
        (player: Player, playerIndex: number) =>
          `<td>${scoreStore.rounds.reduce(
            (total: number, round: Round) =>
              total + (round.scores[playerIndex].score || 0),
            0
          )}</td>`
      )
      .join("") +
    "</tr>";

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
    ${playerHeader}
    ${playerScores}
    ${playerTotals}
  </table>
  </body>
  </html>
  `;
  sharingOptions.value.files.push(
    dataURLtoFile(`data:text/html;base64,${btoa(html)}`, "scorekeeper.html")
  );
  console.log("updateSharingHtml done");
}

export async function startShare(elementId: string) {
  console.log("startShare");
  sharingOptions.value.url = isClient ? location.href : "";
  updateSharingText();
  //sharingOptions.value.files = []
  //updateSharingHtml()
  //await updateSharingScreenshot(elementId)

  try {
    await share();
    sendAnalyticsEvent("share_game");
  } catch (err) {
    console.error("share error ", err);
  }
  console.log("startShare done");
}

export function addToHomeScreen() {
  sendAnalyticsEvent("add_to_home_screen");
  addToHomeScreenInstance.show(); // show "add-to-homescreen" instructions to user, or do nothing if already added to homescreen
  // The only argument is the language to show the messages in (currently only 'de', 'en', 'pt' and 'fr' are available).
}
