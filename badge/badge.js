/**
 * Code behind for the extension's badge UI. This file handles
 * creating container div, initializing Popup.elm, as well as
 * passing data between the Elm app and background.js.
 */

const pageUrl = document.location.href

chrome.runtime.sendMessage({ type: 'FetchRating', url: pageUrl })
console.log('Fetching rating for ', pageUrl)
