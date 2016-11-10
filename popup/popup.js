/**
 * Code behind for the extension's popup UI. This file handles
 * initializing Popup.elm, as well as passing data between
 * the Elm app and background.js.
 */
const containerId = 'benarid-chromeextension-popup__elm-root'
const container = document.getElementById(containerId)
Elm.Popup.embed(container)
