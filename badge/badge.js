/**
 * Code behind for the extension's badge UI. This file handles
 * creating container div, initializing Popup.elm, as well as
 * passing data between the Elm app and background.js.
 */

/**
 * Starting the content script. Requests background.js to fetch the rating
 * of the current page.
 */
chrome.runtime.sendMessage({ type: 'FetchRating' })

/**
 * Listens to messages from background.js.
 */
chrome.runtime.onMessage.addListener((msg, sender) => {
  switch(msg.type) {
    case 'FetchRatingSuccess':
      return renderRating(msg.payload)
  }
})

function renderRating(payload) {
  const el = document.createElement('iframe')
  el.className = 'benarid-chromeextension-badge__root'

  el.style.position = 'fixed'
  el.style.top = '20px'
  el.style.left = '0'
  el.style.width = '300px'
  el.style.background = 'white'
  el.style.zIndex = '9999'

  const html =
    ['<ul>']
    .concat(payload.rating.map(({ label, value, count }) =>
      `<li>${label}: ${value} (${count} votes)</li>`
    ))
    .concat(['</ul>']).join('')

  el.src = `data:text/html;charset=utf-8,${encodeURI(html)}`

  console.log(el.width, el.height)

  document.body.appendChild(el)
}
