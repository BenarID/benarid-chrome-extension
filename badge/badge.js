/**
 * Code behind for the extension's badge UI. This file handles
 * rendering the badge, initializing the Elm app, as well as
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
      return render(msg.payload)
  }
})

/**
 * Function to initialize rendering the badge. Only called when
 * fetching rating from the server is successful. This will construct
 * the elements and embed the Elm app to the resulting iframe.
 *
 * @param  {object} payload The response from server.
 */
function render(payload) {
  const link = document.createElement('link')
  link.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
  link.rel = 'stylesheet'
  document.head.appendChild(link)

  const el = createBadgeElement()
  const content = createContentElement()
  const controls = createControlsElement(content)

  el.appendChild(content)
  el.appendChild(controls)

  document.body.appendChild(el)

  return fetchTemplate()
    .then(template => {
      const contentDoc = content.contentWindow.document
      contentDoc.open()
      contentDoc.write(template)
      contentDoc.close()

      const root = contentDoc.getElementById('benarid-chromeextension-badge-elmroot')
      initializeElmApp(root, payload)
    })
}

/**
 * Factory for the badge element. This will be the root element on
 * top of which other elements are appended.
 *
 * @return {Element} The badge container element
 */
function createBadgeElement() {
  const el = document.createElement('div')
  el.className = 'benarid-chromeextension-badge__root'

  el.style.position = 'fixed'
  el.style.top = '60px'
  el.style.left = '0'
  el.style.maxWidth = '350px'
  el.style.background = 'white'
  el.style.zIndex = '9999'

  return el
}

/**
 * Factory for the content iframe element. This will contain the Elm app.
 *
 * @return {Element} The content iframe element.
 */
function createContentElement() {
  const content = document.createElement('iframe')
  const contentId = 'benarid-chromeextension-badge__content'
  content.className = contentId
  content.setAttribute('id', contentId)

  content.frameBorder = '0'
  content.style.position = 'absolute'
  content.style.left = '0'
  content.style.width = '300px'
  content.style.background = 'white'
  content.style.boxShadow = '0 0 10px 0 rgba(0,0,0,.3)'

  return content
}

/**
 * Factory for the controls element. This element has buttons for
 * showing/hiding as well as dismissing the badge.
 *
 * @param  {Element} content Reference to content element for showing/hiding.
 * @return {Element}         The controls element.
 */
function createControlsElement(content) {
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

  return controls
}

/**
 * Initializes Elm app. Subscribing to ports also happens here.
 *
 * @param  {Element} root    Root element for embedding the Elm app.
 * @param  {object}  payload Initial flags for the Elm app.
 */
function initializeElmApp(root, payload) {
  const elmApp = Elm.Badge.embed(root, payload)

  // Handle resize requests
  elmApp.ports.resize.subscribe(() => {
    // Wrap this in set timeout to wait for elm finish rendering.
    setTimeout(() => {
      resizeIframe(content)
    }, 100)
  })

  // TODO: handle form submission requests
}

/**
 * Resize an iframe to fit its content.
 *
 * @param  {Element} iframe Reference to the iframe element.
 */
function resizeIframe(iframe) {
  iframe.height = 0
  iframe.height = iframe.contentWindow.document.body.scrollHeight;
}

/**
 * Fetches the template HTML for the iframe contents.
 *
 * @return {Promise} The promise that will resolve with the HTML string.
 */
function fetchTemplate() {
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
