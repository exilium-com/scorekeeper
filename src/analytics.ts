declare global {
    interface Window {
        sa_loaded?: boolean
        sa_event?: (eventName: string) => void
    }
}

export function sendAnalyticsEvent(eventName: string) {
    if (window.sa_loaded && typeof window.sa_event === 'function') {
        console.log('sendAnalyticsEvent: ', eventName)
        window.sa_event(eventName)
    } else {
        console.log('sendAnalyticsEvent: !sa_loaded, tried to send event: ', eventName)
    }
}

export {}
