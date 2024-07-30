export function sendAnalyticsEvent(eventName: string) {
  if (window.sa_loaded) {
    console.log("sendAnalyticsEvent: ", eventName);
    window.sa_event(eventName);
  } else {
    console.log(
      "sendAnalyticsEvent: !sa_loaded, tried to send event: ",
      eventName
    );
  }
}
