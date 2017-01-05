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
  el.style.maxWidth = '350px'
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
  closeButton.style.cursor = 'pointer'
  closeButton.innerHTML = '<i class="fa fa-close"></i>'

  expandButton.style.height = '30px'
  expandButton.style.background = '#1abc9c'
  expandButton.style.color = 'white'
  expandButton.style.textAlign = 'center'
  expandButton.style.fontSize = '24px'
  expandButton.style.cursor = 'pointer'
  expandButton.innerHTML = '<i class="fa fa-chevron-left"></i>'

  const content = document.createElement('iframe')
  content.className = 'benarid-chromeextension-badge__content'
  const contentId = 'benarid-chromeextension-badge__content'
  content.setAttribute('id', contentId)

  expandButton.addEventListener('click', () => {
    if (content.classList.contains('benarid-hidden')) {
      expandButton.innerHTML = '<i class="fa fa-chevron-left"></i>'
      content.style.display = 'block'
      controls.style.left = '300px'
    } else {
      expandButton.innerHTML = '<i class="fa fa-chevron-right"></i>'
      content.style.display = 'none'
      controls.style.left = '0'
    }
    content.classList.toggle('benarid-hidden')
  })

  closeButton.addEventListener('click', () => {
    el.parentNode.removeChild(el)
  })

  content.frameBorder = '0'
  content.style.position = 'absolute'
  content.style.left = '0'
  content.style.width = '300px'
  content.style.background = 'white'
  content.style.boxShadow = '0 0 10px 0 rgba(0,0,0,.3)'

  const html =
    []
    .concat(payload.rating.map(({ label, sum, count }) => {
      const percentage = count > 0 ? 100.0 * sum / count : 0
      const color = getColor(percentage)
      return `
        <div class="benarid-chromeextension-badge-content__rating">
          <div class="benarid-chromeextension-badge-content__header">
            ${label}:
            <span class="benarid-count">
              ${percentage}<span class="benarid-divider">/100 (${count} votes)</span>
            </span>
          </div>
          <div class="benarid-chromeextension-badge-content__value">
            <div
              class="benarid-rating-bar benarid-${color}"
              style="width: ${percentage}%;">
            </div>
          </div>
        </div>
      `
    }))
    .concat(`
      <div class="benarid-chromeextension-badge-content__rate-button">
        <button>Nilai artikel ini</button>
      </div>
    `)
    .join('')

  el.appendChild(content)
  el.appendChild(controls)

  document.body.appendChild(el)

  fetchTemplateHead()
    .then(templateHead => {
      htmlWithHead = templateHead + html

      const iframe = document.getElementById(contentId)
      iframe.contentWindow.document.open()
      iframe.contentWindow.document.write(htmlWithHead)
      iframe.contentWindow.document.close()

      iframe.width  = iframe.contentWindow.document.body.scrollWidth;
      iframe.height = iframe.contentWindow.document.body.scrollHeight;
    })
}

function getColor(percentage) {
  return percentage < 50 ? 'red' : 'green';
}

function fetchTemplateHead() {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', chrome.extension.getURL('badge/head.html'), true)

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        resolve(xhr.responseText)
      }
    }

    xhr.send()
  })
}
