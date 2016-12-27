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
  const link = document.createElement('link')
  link.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
  link.rel = 'stylesheet'
  document.head.appendChild(link)

  const el = document.createElement('div')
  el.className = 'benarid-chromeextension-badge__root'

  el.style.position = 'fixed'
  el.style.top = '60px'
  el.style.left = '0'
  el.style.width = '350px'
  el.style.background = 'white'
  el.style.zIndex = '9999'

  const controls = document.createElement('div')
  controls.className = 'benarid-chromeextension-badge__controls'

  const closeButton = document.createElement('div')
  const expandButton = document.createElement('div')

  controls.appendChild(closeButton)
  controls.appendChild(expandButton)

  controls.style.position = 'absolute'
  controls.style.left = '300px'
  controls.style.width = '30px'

  closeButton.style.height = '30px'
  closeButton.style.background = '#e74c3c'
  closeButton.style.color = 'white'
  closeButton.style.textAlign = 'center'
  closeButton.style.fontSize = '24px'
  closeButton.innerHTML = '<i class="fa fa-close"></i>'

  expandButton.style.height = '30px'
  expandButton.style.background = '#1abc9c'
  expandButton.style.color = 'white'
  expandButton.style.textAlign = 'center'
  expandButton.style.fontSize = '24px'
  expandButton.innerHTML = '<i class="fa fa-chevron-left"></i>'

  const content = document.createElement('iframe')
  content.className = 'benarid-chromeextension-badge__content'

  content.frameBorder = '0'
  content.style.position = 'absolute'
  content.style.left = '0'
  content.style.width = '300px'
  content.style.background = 'white'
  content.style.boxShadow = '0 0 10px 0 rgba(0,0,0,.3)'

  const html =
    ['<ul>']
    .concat(payload.rating.map(({ label, value, count }) =>
      `<li>${label}: ${value} (${count} votes)</li>`
    ))
    .concat(['</ul>'])
    .join('')

  content.src = `data:text/html;charset=utf-8,${encodeURI(html)}`

  el.appendChild(content)
  el.appendChild(controls)

  document.body.appendChild(el)
}
