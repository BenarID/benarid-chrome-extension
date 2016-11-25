/**
 * Code behind for the extension's popup UI. This file handles
 * initializing Popup.elm, as well as passing data between
 * the Elm app and background.js.
 */

/**
 * Embed the Elm UI.
 */
const containerId = 'benarid-chromeextension-popup__elm-root'
const container = document.getElementById(containerId)
const elmApp = Elm.Popup.embed(container)

/**
 * Listens to background events and sends to UI.
 */
chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.type) {

    case 'SignInSuccess':
      return elmApp.ports.signInSub.send({
        success: true,
        name: msg.name,
      })

    case 'SignInFailed':
      return elmApp.ports.signInSub.send({
        success: false,
      })

    // case 'FetchRatingSuccess':
    //   return elmApp.ports.fetchRatingSub.send({
    //     success: true,
    //     rating: msg.rating,
    //   })
    //
    // case 'FetchRatingFailed':
    //   return elmApp.ports.fetchRatingSub.send({
    //     success: false,
    //   })
    //
    // case 'SubmitRatingSuccess':
    //   return elmApp.ports.submitRatingSub.send({
    //     success: true,
    //   })
    //
    // case 'SubmitRatingFailed':
    //   return elmApp.ports.submitRatingSub.send({
    //     success: false,
    //   })

    default:
      return
  }
})

/**
 * Listens to UI events and sends to background.
 */
elmApp.ports.signIn.subscribe(() => {
  chrome.runtime.sendMessage({ type: 'SignIn' })
})
//
// elmApp.ports.signOut.subscribe(() => {
//   chrome.runtime.sendMessage({ type: 'SignOut' })
// })
//
// elmApp.ports.fetchRating.subscribe(() => {
//   chrome.runtime.sendMessage({ type: 'FetchRating' })
// })
//
// elmApp.ports.submitRating.subscribe((values) => {
//   chrome.runtime.sendMessage({ type: 'SubmitRating', values: values })
// })
