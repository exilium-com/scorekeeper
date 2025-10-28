import { ref } from 'vue'
import { isClient } from '@vueuse/shared'
import { useShare } from '@vueuse/core'
import { useScoreStore } from '@/stores/score-store'
import { type Round, type Player } from '@/types/player'
import { sendAnalyticsEvent } from '@/analytics'

declare global {
    interface Window {
        AddToHomeScreen: {
            new (options: { appName: string; appIconUrl: string; assetUrl: string; showErrorMessageForUnsupportedBrowsers: unknown }): {
                show: () => void
            }
            SHOW_ERRMSG_UNSUPPORTED: {
                ALL: unknown
            }
        }
    }
}

const scoreStore = useScoreStore()

const sharingOptions = ref({
    title: 'Score Keeper',
    text: 'Current Scores',
    url: isClient ? location.href : '',
})

export const { share, isSupported: isSharingSupported } = useShare(sharingOptions)

const addToHomeScreenInstance = new window.AddToHomeScreen({
    appName: 'Score Keeper',
    appIconUrl: 'apple-touch-icon.png',
    assetUrl: 'https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@1.8/dist/assets/img/',
    showErrorMessageForUnsupportedBrowsers: window.AddToHomeScreen.SHOW_ERRMSG_UNSUPPORTED.ALL,
})

function updateSharingText() {
    const filledRounds = scoreStore.rounds.filter((_, roundIndex: number) => !scoreStore.isRoundEmpty(roundIndex))

    // scoreStore.players has the player names and scoreStore.rounds has the array of rounds with the scores
    // for each player, we print the name, then the score for each round separated by +, then the total score
    const text = scoreStore.players
        .map((player: Player, playerIndex: number) => {
            const playerTotal = scoreStore.rounds.reduce((total: number, round: Round) => total + (round.scores[playerIndex].score || 0), 0)
            return `${player.name || player.placeholder}: ${
                filledRounds.length === 1 ? '' : filledRounds.map((round: Round) => round.scores[playerIndex].score || 0).join(' + ') + ' ='
            } ${playerTotal}`
        })
        .join('\n')

    sharingOptions.value.text = text + '\n'
}

export async function startShare() {
    console.log('startShare')
    sharingOptions.value.url = isClient ? location.href : ''
    updateSharingText()
    //sharingOptions.value.files = []

    try {
        await share()
        sendAnalyticsEvent('share_game')
    } catch (err) {
        console.error('share error ', err)
    }
    console.log('startShare done')
}

export function addToHomeScreen() {
    sendAnalyticsEvent('add_to_home_screen')
    addToHomeScreenInstance.show() // show "add-to-homescreen" instructions to user, or do nothing if already added to homescreen
    // The only argument is the language to show the messages in (currently only 'de', 'en', 'pt' and 'fr' are available).
}
